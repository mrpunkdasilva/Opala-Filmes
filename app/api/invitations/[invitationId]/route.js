import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/app/services/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(request, { params }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email || !session.user.id) {
        return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
    }

    const { invitationId } = params;
    if (!invitationId || !ObjectId.isValid(invitationId)) {
        return NextResponse.json({ message: 'ID do convite inválido.' }, { status: 400 });
    }

    try {
        const { action } = await request.json(); // 'accept' or 'decline'
        if (!action || !['accept', 'decline'].includes(action)) {
            return NextResponse.json({ message: 'Ação inválida.' }, { status: 400 });
        }

        const db = await connectToDatabase();
        const o_invitationId = new ObjectId(invitationId);
        const currentUserId = new ObjectId(session.user.id);
        const currentUserEmail = session.user.email;

        const invitation = await db.collection('invitations').findOne({ _id: o_invitationId });

        if (!invitation) {
            return NextResponse.json({ message: 'Convite não encontrado.' }, { status: 404 });
        }

        if (invitation.status !== 'pending') {
            return NextResponse.json({ message: 'Convite já foi processado.' }, { status: 400 });
        }

        if (invitation.toUserEmail !== currentUserEmail) {
            return NextResponse.json({ message: 'Você não tem permissão para processar este convite.' }, { status: 403 });
        }

        if (action === 'accept') {
            const crew = await db.collection('groups').findOne({ _id: invitation.crewId });

            if (!crew) {
                return NextResponse.json({ message: 'Crew associada ao convite não encontrada.' }, { status: 404 });
            }

            const isAlreadyMember = crew.members.some(member => member.userId.equals(currentUserId));
            if (isAlreadyMember) {
                // If somehow already a member, just update invitation status
                await db.collection('invitations').updateOne(
                    { _id: o_invitationId },
                    { $set: { status: 'accepted' } }
                );
                return NextResponse.json({ message: 'Você já é membro desta crew. Convite aceito.' }, { status: 200 });
            }

            // Add user to crew members
            await db.collection('groups').updateOne(
                { _id: invitation.crewId },
                { $push: { members: { userId: currentUserId, role: 'member' } } }
            );

            // Update invitation status
            await db.collection('invitations').updateOne(
                { _id: o_invitationId },
                { $set: { status: 'accepted' } }
            );

            return NextResponse.json({ message: 'Convite aceito com sucesso! Você agora é membro da crew.' }, { status: 200 });

        } else if (action === 'decline') {
            await db.collection('invitations').updateOne(
                { _id: o_invitationId },
                { $set: { status: 'declined' } }
            );
            return NextResponse.json({ message: 'Convite recusado com sucesso.' }, { status: 200 });
        }

    } catch (error) {
        console.error('Erro ao processar convite:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}
