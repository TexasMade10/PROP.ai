import { NextRequest, NextResponse } from 'next/server';
import { DatabaseInitializer } from '@/lib/db-init';

export async function POST(request: NextRequest) {
  try {
    // Check for authorization (you might want to add proper auth here)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // For now, we'll use a simple token check
    // In production, you should validate this properly
    if (token !== process.env.DB_INIT_TOKEN) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Initialize the database
    await DatabaseInitializer.initializeDatabase();

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    
    return NextResponse.json(
      { 
        error: 'Database initialization failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check for authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    if (token !== process.env.DB_INIT_TOKEN) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Reset the database
    await DatabaseInitializer.resetDatabase();

    return NextResponse.json({
      success: true,
      message: 'Database reset successfully'
    });

  } catch (error) {
    console.error('Database reset error:', error);
    
    return NextResponse.json(
      { 
        error: 'Database reset failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 