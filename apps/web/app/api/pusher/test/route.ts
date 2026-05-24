import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channel, event, message } = body;

    if (!channel || !event || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: channel, event, message' },
        { status: 400 },
      );
    }

    const apiBaseUrl =
     'http://localhost:8080/api/v1';

    const response = await fetch(`${apiBaseUrl}/pusher/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel,
        event,
        data: { message },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', response.status, errorText);
      return NextResponse.json(
        { error: `Backend error: ${response.status} - ${errorText}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error triggering Pusher event:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to trigger Pusher event',
      },
      { status: 500 },
    );
  }
}
