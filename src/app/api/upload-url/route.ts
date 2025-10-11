// app/api/upload-url/route.ts
import { NextResponse } from 'next/server';
import { sbAdmin } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  try {
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 },
      );
    }

    const { path } = body;

    if (!path || typeof path !== 'string') {
      console.error('Invalid path:', path);
      return NextResponse.json(
        { error: 'Valid path is required' },
        { status: 400 },
      );
    }

    console.log('Creating signed upload URL for path:', path);

    // Get Supabase admin client
    let sb;
    try {
      sb = sbAdmin();
    } catch (clientError) {
      console.error('Failed to create Supabase client:', clientError);
      return NextResponse.json(
        { error: 'Database connection failed. Check environment variables.' },
        { status: 500 },
      );
    }

    // Create signed upload URL
    const { data, error } = await sb.storage
      .from('driver-docs')
      .createSignedUploadUrl(path);

    if (error) {
      console.error('Supabase storage error:', error);
      return NextResponse.json(
        { error: `Storage error: ${error.message}` },
        { status: 400 },
      );
    }

    if (!data) {
      console.error('No data returned from Supabase');
      return NextResponse.json(
        { error: 'No data returned from storage service' },
        { status: 500 },
      );
    }

    if (!data.token) {
      console.error('No token in response:', data);
      return NextResponse.json(
        { error: 'No upload token generated' },
        { status: 500 },
      );
    }

    console.log('Upload token generated successfully for:', path);
    return NextResponse.json({
      token: data.token,
      path: data.path,
      signedUrl: data.signedUrl,
    });
  } catch (error) {
    console.error('Upload URL route error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Server error: ${errorMessage}` },
      { status: 500 },
    );
  }
}
