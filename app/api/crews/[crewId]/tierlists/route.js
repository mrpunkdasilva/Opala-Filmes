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
        const currentUserId = new ObjectId(session.user.id);
        const o_crewId = new ObjectId(crewId);

        // Check if user is a member of the crew
        const crew = await db.collection('groups').findOne(
            { _id: o_crewId, 'members.userId': currentUserId },
            { projection: { _id: 1 } } // Only need to confirm membership
        );

        if (!crew) {
            return NextResponse.json({ message: 'Acesso negado. Você não é membro desta crew.' }, { status: 403 });
        }

        const tierLists = await db.collection('tierLists').find({ groupId: o_crewId }).toArray();

        return NextResponse.json(tierLists, { status: 200 });

    } catch (error) {
        console.error('Erro ao buscar tier lists:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}

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
        const { name, tiers } = await request.json();

        if (!name) {
            return NextResponse.json({ message: 'O nome da tier list é obrigatório.' }, { status: 400 });
        }

        const db = await connectToDatabase();
        const currentUserId = new ObjectId(session.user.id);
        const o_crewId = new ObjectId(crewId);

        // Check if user is a member of the crew
        const crew = await db.collection('groups').findOne(
            { _id: o_crewId, 'members.userId': currentUserId },
            { projection: { _id: 1 } } // Only need to confirm membership
        );

        if (!crew) {
            return NextResponse.json({ message: 'Acesso negado. Você não é membro desta crew.' }, { status: 403 });
        }

        const newTierList = {
            name,
            groupId: o_crewId,
            tiers: tiers || [], // Default to empty array if not provided
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection('tierLists').insertOne(newTierList);

        return NextResponse.json({ message: 'Tier list criada com sucesso!', tierListId: result.insertedId }, { status: 201 });

    } catch (error) {
        console.error('Erro ao criar tier list:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}
