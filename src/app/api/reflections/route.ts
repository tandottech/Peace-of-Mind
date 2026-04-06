import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { text, mood } = await req.json();
    
    // Fallback demo user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: "demo@example.com", name: "Demo User" }
      });
    }

    const reflection = await prisma.reflection.create({
      data: {
        userId: user.id,
        text,
        mood
      }
    });

    return NextResponse.json(reflection);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
