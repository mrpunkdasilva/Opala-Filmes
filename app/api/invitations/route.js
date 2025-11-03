import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/app/services/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email || !session.user.id) {
        return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
    }

    try {
        const db = await connectToDatabase();
        const userEmail = session.user.email;
        const userId = new ObjectId(session.user.id);

        const aggregationPipeline = [
            { $match: { toUserEmail: userEmail, status: 'pending' } },
            {
                $lookup: {
                    from: 'groups',
                    localField: 'crewId',
                    foreignField: '_id',
                    as: 'crewDetails'
                }
            },
            { $unwind: '$crewDetails' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'fromUserId',
                    foreignField: '_id',
                    as: 'senderDetails'
                }
            },
            { $unwind: '$senderDetails' },
            {
                $project: {
                    'crewDetails.members': 0, // Don't send all member details
                    'senderDetails.passwordHash': 0,
                    'senderDetails.email': 0,
                }
            }
        ];

        const invitations = await db.collection('invitations').aggregate(aggregationPipeline).toArray();

        return NextResponse.json(invitations, { status: 200 });

    } catch (error) {
        console.error('Erro ao buscar convites:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}
