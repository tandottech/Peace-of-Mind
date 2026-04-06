import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // In a real app we'd call an LLM API here. 
    // We will simulate AI Response
    const aiResponse = "The effort you invested hasn't vanished—it's become skill and endurance. This specific path may be closed, but your preparedness has never been higher for the one that is actually yours.";
    const tags = "Persistence,Growth Mindset,Perspective Shift";
    
    // Ensure we have a default user for demo if none exists
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "demo@example.com",
          name: "Demo User",
        }
      });
    }

    const reframe = await prisma.reframeEntry.create({
      data: {
        userId: user.id,
        prompt,
        aiResponse,
        tags
      }
    });

    return NextResponse.json(reframe);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
