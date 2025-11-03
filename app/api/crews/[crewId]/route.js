import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/app/services/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
    }

    const { crewId } = await params;

    if (!crewId || !ObjectId.isValid(crewId)) {
        return NextResponse.json({ message: 'ID da crew inválido.' }, { status: 400 });
    }

    try {
        const db = await connectToDatabase();
        const userId = new ObjectId(session.user.id);
        const o_crewId = new ObjectId(crewId);

        const aggregationPipeline = [
            { $match: { _id: o_crewId } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'members.userId',
                    foreignField: '_id',
                    as: 'memberDetails'
                }
            },
            {
                $addFields: {
                    members: {
                        $map: {
                            input: '$members',
                            as: 'member',
                            in: {
                                $mergeObjects: [
                                    '$$member',
                                    {
                                        user: {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: '$memberDetails',
                                                        cond: { $eq: ['$$this._id', '$$member.userId'] }
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'media',
                    localField: 'movies',
                    foreignField: '_id',
                    as: 'movieDetails'
                }
            },
            {
                $addFields: {
                    movies: {
                        $map: {
                            input: '$movies',
                            as: 'movieId',
                            in: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: '$movieDetails',
                                            cond: { $eq: ['$$this._id', '$$movieId'] }
                                        }
                                    },
                                    0
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    'memberDetails': 0,
                    'members.user.passwordHash': 0,
                    'members.user.email': 0,
                    'movieDetails': 0,
                    'movies.addedBy': 0,
                    'movies.addedInGroups': 0,
                }
            }
        ];

        const results = await db.collection('groups').aggregate(aggregationPipeline).toArray();

        if (results.length === 0) {
            return NextResponse.json({ message: 'Crew não encontrada.' }, { status: 404 });
        }

        const crew = results[0];

        // Check if the user is a member of the crew
        const isMember = crew.members.some(member => member.userId.equals(userId));

        if (!isMember) {
            return NextResponse.json({ message: 'Acesso negado. Você não é membro desta crew.' }, { status: 403 });
        }

        return NextResponse.json(crew, { status: 200 });

    } catch (error) {
        console.error('Erro ao buscar a crew:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}
