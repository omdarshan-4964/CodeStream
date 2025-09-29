// src/app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key'; // IMPORTANT: Add JWT_SECRET to your .env file

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Generate a JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d', // Token expires in 1 day
    });

    return NextResponse.json({ token });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}