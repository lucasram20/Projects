import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < message.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        controller.enqueue(encoder.encode(message[i]));
      }
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}