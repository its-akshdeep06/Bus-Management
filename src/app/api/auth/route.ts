import { NextResponse } from 'next/server';
import { userStore } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, username, password, name } = body;

    if (!username || !password) {
      return NextResponse.json(
        { status: 'error', message: 'Username/phone and password are required.' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();

    if (action === 'register') {
      if (userStore[cleanUsername]) {
        return NextResponse.json(
          { status: 'error', message: 'Account already exists! Please sign in.' },
          { status: 409 }
        );
      }
      userStore[cleanUsername] = password;
      return NextResponse.json({
        status: 'success',
        message: 'Account registered successfully! Welcome to Safar.',
        username: cleanUsername,
        name: name || cleanUsername,
      });
    }

    // Default action: login
    if (userStore[cleanUsername] && userStore[cleanUsername] === password) {
      return NextResponse.json({
        status: 'success',
        message: 'Signed in successfully!',
        username: cleanUsername,
      });
    }

    return NextResponse.json(
      { status: 'error', message: 'Invalid credentials. If you are new, please register first.' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ status: 'error', message: 'Invalid request body.' }, { status: 400 });
  }
}
