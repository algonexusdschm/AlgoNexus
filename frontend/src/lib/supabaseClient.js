import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vcswkusqdkyhyanytjlc.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjc3drdXNxZGt5aHlhbnl0amxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NDg1NjEsImV4cCI6MjEwNjQyNDU2MX0.2u2J3D3ef9YnqScgX0QjlWW8-cjsI0NXyfVt-ZheoA4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Uploads an image (File or base64 Data URL) to a Supabase Storage bucket.
 * If bucket upload fails (e.g. bucket doesn't exist yet), gracefully returns the base64 data URL.
 */
export async function uploadImageToSupabase(fileOrDataUrl, bucketName = 'organizer-assets', folder = 'uploads') {
  if (!fileOrDataUrl) return '';

  // If already a remote URL (https://...), return as-is
  if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('http')) {
    return fileOrDataUrl;
  }

  try {
    let fileToUpload = fileOrDataUrl;
    let extension = 'jpg';

    // If it's a base64 Data URL, convert to Blob
    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
      const match = fileOrDataUrl.match(/data:([^;]+);base64,(.*)/);
      if (match) {
        const mimeType = match[1];
        extension = mimeType.split('/')[1] || 'jpg';
        const byteCharacters = atob(match[2]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        fileToUpload = new Blob([byteArray], { type: mimeType });
      }
    } else if (fileOrDataUrl.name) {
      extension = fileOrDataUrl.name.split('.').pop() || 'jpg';
    }

    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileToUpload, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.warn(`Supabase Storage upload to "${bucketName}" returned error:`, error.message);
      // Fallback: return the original base64/data URL so image is never lost
      return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '';
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return publicUrlData?.publicUrl || (typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
  } catch (err) {
    console.warn('Storage upload exception, using fallback:', err);
    return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '';
  }
}
