import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, isUrgent, duration } = await req.json();
    
    // Fallback demo user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: "demo@example.com", name: "Demo User" }
      });
    }

    const task = await prisma.task.create({
      data: {
        userId: user.id,
        title,
        isUrgent: !!isUrgent,
        duration: duration || null
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
