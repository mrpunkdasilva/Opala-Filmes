import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/app/services/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
    }

    const userId = new ObjectId(session.user.id);

    try {
        const db = await connectToDatabase();

        const crews = await db.collection('groups').find({
            'members.userId': userId
        }).toArray();

        return NextResponse.json(crews, { status: 200 });

    } catch (error) {
        console.error('Erro ao buscar as crews:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}

export async function POST(request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
    }

    try {
        const { name, description } = await request.json();

        if (!name) {
            return NextResponse.json({ message: 'O nome da crew é obrigatório.' }, { status: 400 });
        }

        const db = await connectToDatabase();

        const ownerId = new ObjectId(session.user.id);

        const newCrew = {
            name,
            description: description || '',
            ownerId: ownerId,
            members: [{ userId: ownerId, role: 'owner' }],
            createdAt: new Date(),
        };

        const result = await db.collection('groups').insertOne(newCrew);

        return NextResponse.json({ message: 'Crew criada com sucesso!', crewId: result.insertedId }, { status: 201 });

    } catch (error) {
        console.error('Erro ao criar a crew:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}
