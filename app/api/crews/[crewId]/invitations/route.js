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
        const { email: invitedEmail } = await request.json();
        if (!invitedEmail) {
            return NextResponse.json({ message: 'O email do convidado é obrigatório.' }, { status: 400 });
        }

        const db = await connectToDatabase();
        const currentUserId = new ObjectId(session.user.id);
        const o_crewId = new ObjectId(crewId);

        // 1. Fetch crew and check permissions
        const crew = await db.collection('groups').findOne({ _id: o_crewId });
        if (!crew) {
            return NextResponse.json({ message: 'Crew não encontrada.' }, { status: 404 });
        }

        const currentUserMember = crew.members.find(m => m.userId.equals(currentUserId));
        if (!currentUserMember || !['owner', 'admin'].includes(currentUserMember.role)) {
            return NextResponse.json({ message: 'Você não tem permissão para convidar membros para esta crew.' }, { status: 403 });
        }

        // 2. Find the user to invite
        const invitedUser = await db.collection('users').findOne({ email: invitedEmail });
        if (!invitedUser) {
            return NextResponse.json({ message: 'Usuário não encontrado com este email.' }, { status: 404 });
        }

        if (invitedUser._id.equals(currentUserId)) {
            return NextResponse.json({ message: 'Você não pode convidar a si mesmo.' }, { status: 400 });
        }

        // 3. Check if user is already a member
        const isAlreadyMember = crew.members.some(m => m.userId.equals(invitedUser._id));
        if (isAlreadyMember) {
            return NextResponse.json({ message: 'Este usuário já é um membro da crew.' }, { status: 409 });
        }

        // 4. Check for existing pending invitation
        const existingInvitation = await db.collection('invitations').findOne({
            crewId: o_crewId,
            toUserEmail: invitedEmail,
            status: 'pending'
        });

        if (existingInvitation) {
            return NextResponse.json({ message: 'Já existe um convite pendente para este usuário.' }, { status: 409 });
        }

        // 5. Create invitation
        const newInvitation = {
            crewId: o_crewId,
            fromUserId: currentUserId,
            toUserEmail: invitedEmail,
            status: 'pending',
            createdAt: new Date(),
        };

        await db.collection('invitations').insertOne(newInvitation);

        return NextResponse.json({ message: 'Convite enviado com sucesso!' }, { status: 201 });

    } catch (error) {
        console.error('Erro ao enviar convite:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}
