import { NextResponse } from 'next/server';
import { userStore } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { status: 'error', message: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();

    if (action === 'register') {
      if (userStore[cleanUsername]) {
        return NextResponse.json(
          { status: 'error', message: 'Username already exists! Please log in.' },
          { status: 409 }
        );
      }
      userStore[cleanUsername] = password;
      return NextResponse.json({
        status: 'success',
        message: 'Account registered successfully! You can now log in.',
        username: cleanUsername
      });
    }

    // Default action: login
    if (userStore[cleanUsername] && userStore[cleanUsername] === password) {
      return NextResponse.json({
        status: 'success',
        message: 'Login successful!',
        username: cleanUsername
      });
    }

    return NextResponse.json(
      { status: 'error', message: 'Invalid username or password.' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Invalid request body.' },
      { status: 400 }
    );
  }
}

