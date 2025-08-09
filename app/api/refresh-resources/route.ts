import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST() {
  try {
    // Revalidate all resource-related paths
    revalidatePath('/resources');
    revalidatePath('/resource/[book-name]', 'layout');
    revalidatePath('/resource/[book-name]/[chapter-id]', 'layout');
    
    console.log('[REFRESH] Resource pages cache cleared');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Resource cache cleared successfully',
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('[REFRESH] Error clearing cache:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to clear cache' 
    }, { status: 500 });
  }
}