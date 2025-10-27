import { NextResponse } from "next/server";
import { connectToDatabase } from "../../services/mongodb";
import bcrypt from "bcryptjs";
import { registerSchema } from "../../lib/validators/auth";
import { z } from "zod";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, email, password } = registerSchema.parse(body);

    const db = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Já existe um usuário com este email." },
        { status: 409 } // 409 Conflict
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user
    await db.collection("users").insertOne({
      username,
      email,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Usuário registrado com sucesso." },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Ocorreu um erro interno no servidor." },
      { status: 500 }
    );
  }
}
