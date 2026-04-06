import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { path } = await req.json();
    
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "demo@example.com",
          name: "Demo User",
        }
      });
    }

    const quizResult = await prisma.quizResult.create({
      data: {
        userId: user.id,
        path
      }
    });

    return NextResponse.json(quizResult);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
