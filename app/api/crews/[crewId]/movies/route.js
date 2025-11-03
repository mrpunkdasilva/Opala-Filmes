import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/app/services/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
    }

    const { crewId } = params;
    if (!crewId || !ObjectId.isValid(crewId)) {
        return NextResponse.json({ message: 'ID da crew inválido.' }, { status: 400 });
    }

    try {
        const { tmdbId, title, type, posterPath, releaseDate } = await request.json();

        if (!tmdbId || !title || !type) {
            return NextResponse.json({ message: 'Dados do filme incompletos.' }, { status: 400 });
        }

        const db = await connectToDatabase();
        const currentUserId = new ObjectId(session.user.id);
        const o_crewId = new ObjectId(crewId);

        // 1. Check if user is a member of the crew
        const crew = await db.collection('groups').findOne({ _id: o_crewId });
        if (!crew) {
            return NextResponse.json({ message: 'Crew não encontrada.' }, { status: 404 });
        }

        // Ensure crew.movies is an array
        if (!crew.movies) {
            crew.movies = [];
        }

        const isMember = crew.members.some(member => member.userId.equals(currentUserId));
        if (!isMember) {
            return NextResponse.json({ message: 'Você não é membro desta crew.' }, { status: 403 });
        }

        // 2. Find or create media document
        let media = await db.collection('media').findOne({ tmdbId: tmdbId, type: type });

        if (!media) {
            const newMedia = {
                tmdbId: tmdbId,
                title: title,
                type: type,
                posterPath: posterPath || null,
                releaseDate: releaseDate ? new Date(releaseDate) : null,
                addedBy: currentUserId,
                addedInGroups: [o_crewId],
                addedAt: new Date(),
            };
            const result = await db.collection('media').insertOne(newMedia);
            media = { _id: result.insertedId, ...newMedia };
        } else {
            // Ensure the crewId is in addedInGroups if media already exists
            if (!media.addedInGroups.some(id => id.equals(o_crewId))) {
                await db.collection('media').updateOne(
                    { _id: media._id },
                    { $push: { addedInGroups: o_crewId } }
                );
            }
        }

        // 3. Add media to crew's movies array
        if (!crew.movies.some(movieId => movieId.equals(media._id))) {
            await db.collection('groups').updateOne(
                { _id: o_crewId },
                { $push: { movies: media._id } }
            );
        } else {
            return NextResponse.json({ message: 'Filme já adicionado a esta crew.' }, { status: 409 });
        }

        return NextResponse.json({ message: 'Filme adicionado à crew com sucesso!', movieId: media._id }, { status: 201 });

    } catch (error) {
        console.error('Erro ao adicionar filme à crew:', error);
        return NextResponse.json({ message: 'Erro interno do servidor ao adicionar filme.' }, { status: 500 });
    }
}
