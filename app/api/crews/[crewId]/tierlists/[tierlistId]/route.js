import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/app/services/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(request, { params }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
    }

    const { crewId, tierlistId } = params;
    if (!crewId || !ObjectId.isValid(crewId) || !tierlistId || !ObjectId.isValid(tierlistId)) {
        return NextResponse.json({ message: 'ID da crew ou tier list inválido.' }, { status: 400 });
    }

    try {
        const { name, tiers } = await request.json();

        if (!name && !tiers) {
            return NextResponse.json({ message: 'Nenhum dado para atualizar.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const currentUserId = new ObjectId(session.user.id);
        const o_crewId = new ObjectId(crewId);
        const o_tierlistId = new ObjectId(tierlistId);

        // Check if user is a member of the crew
        const crew = await db.collection('groups').findOne(
            { _id: o_crewId, 'members.userId': currentUserId },
            { projection: { _id: 1 } } // Only need to confirm membership
        );

        if (!crew) {
            return NextResponse.json({ message: 'Acesso negado. Você não é membro desta crew.' }, { status: 403 });
        }

        // Check if tier list belongs to the crew
        const tierList = await db.collection('tierLists').findOne({ _id: o_tierlistId, groupId: o_crewId });
        if (!tierList) {
            return NextResponse.json({ message: 'Tier list não encontrada ou não pertence a esta crew.' }, { status: 404 });
        }

        const updateDoc = { updatedAt: new Date() };
        if (name) updateDoc.name = name;
        if (tiers) updateDoc.tiers = tiers;

        await db.collection('tierLists').updateOne(
            { _id: o_tierlistId },
            { $set: updateDoc }
        );

        return NextResponse.json({ message: 'Tier list atualizada com sucesso!' }, { status: 200 });

    } catch (error) {
        console.error('Erro ao atualizar tier list:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
    }

    const { crewId, tierlistId } = params;
    if (!crewId || !ObjectId.isValid(crewId) || !tierlistId || !ObjectId.isValid(tierlistId)) {
        return NextResponse.json({ message: 'ID da crew ou tier list inválido.' }, { status: 400 });
    }

        const db = await connectToDatabase();
        const currentUserId = new ObjectId(session.user.id);
        const o_crewId = new ObjectId(crewId);
        const o_tierlistId = new ObjectId(tierlistId);

        // Check if user is a member of the crew
        const crew = await db.collection('groups').findOne(
            { _id: o_crewId, 'members.userId': currentUserId },
            { projection: { _id: 1 } } // Only need to confirm membership
        );

        if (!crew) {
            return NextResponse.json({ message: 'Acesso negado. Você não é membro desta crew.' }, { status: 403 });
        }

        // Check if tier list belongs to the crew
        const tierList = await db.collection('tierLists').findOne({ _id: o_tierlistId, groupId: o_crewId });
        if (!tierList) {
            return NextResponse.json({ message: 'Tier list não encontrada ou não pertence a esta crew.' }, { status: 404 });
        }

        // For deletion, let's assume only owner/admin can delete for now, or the creator of the tier list
        // This logic can be refined later based on specific requirements.
        // For now, any member can delete their own tier list.
        // If we want to restrict to owner/admin, we'd need to fetch the full crew object and check roles.

        await db.collection('tierLists').deleteOne({ _id: o_tierlistId });

        return NextResponse.json({ message: 'Tier list excluída com sucesso!' }, { status: 200 });

    } catch (error) {
        console.error('Erro ao excluir tier list:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}
