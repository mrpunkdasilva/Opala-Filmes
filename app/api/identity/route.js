import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectToDatabase } from "../../services/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
    }

    if (user.gemSeed) {
      return NextResponse.json(
        { message: "Identidade já criada", gemSeed: user.gemSeed },
        { status: 409 } // Conflict
      );
    }

    // Use the user's ID as the seed for the gem.
    // This ensures every user has a unique and deterministic gem.
    const gemSeed = userId;

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { gemSeed: gemSeed, updatedAt: new Date() } }
    );

    return NextResponse.json(
      { message: "Identidade criada com sucesso", gemSeed: gemSeed },
      { status: 201 }
    );
  } catch (error) {
    console.error("Identity creation error:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro interno no servidor." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { gemSeed: 1, username: 1 } } // Only get necessary fields
    );

    if (!user) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(
      { gemSeed: user.gemSeed || null, username: user.username },
      { status: 200 }
    );
  } catch (error) {
    console.error("Identity fetch error:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro interno no servidor." },
      { status: 500 }
    );
  }
}
