'use server';

import { Innertube } from 'youtubei.js';

export interface YouTubeMetadata {
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: string;
  description: string;
}

export interface YouTubeTranscript {
  text: string;
  segments: Array<{
    text: string;
    start: number;
    duration: number;
  }>;
}

// Singleton instance untuk reuse connection
let youtubeInstance: Innertube | null = null;
let instanceCreationTime = 0;
const INSTANCE_LIFETIME = 5 * 60 * 1000; // 5 menit

async function getYouTubeInstance() {
  const now = Date.now();
  
  // Recreate instance jika sudah expired atau belum ada
  if (!youtubeInstance || (now - instanceCreationTime) > INSTANCE_LIFETIME) {
    youtubeInstance = await Innertube.create({
      // Gunakan cache untuk menghindari rate limiting
      cache: undefined,
      // Generate visitor data untuk bypass bot detection
      generate_session_locally: true,
    });
    instanceCreationTime = now;
  }
  
  return youtubeInstance;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getVideoInfo(url: string, retries = 3) {
  const videoId = extractVideoId(url);
  if (!videoId) throw new Error('Invalid YouTube URL');
  
  let lastError: Error | null = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[YouTube] Fetching video info for ${videoId}, attempt ${i + 1}/${retries}`);
      const youtube = await getYouTubeInstance();
      const info = await youtube.getInfo(videoId);
      console.log(`[YouTube] Successfully fetched video info for ${videoId}`);
      return info;
    } catch (error: any) {
      lastError = error;
      console.error(`[YouTube] Error on attempt ${i + 1}/${retries}:`, error.message);
      
      // Jika error 400 (precondition failed), recreate instance dan retry
      if (error.message?.includes('400') || error.message?.includes('Precondition')) {
        console.log(`[YouTube] Retry ${i + 1}/${retries}: Recreating YouTube instance...`);
        youtubeInstance = null; // Force recreate
        
        // Exponential backoff: 1s, 2s, 4s
        if (i < retries - 1) {
          await sleep(Math.pow(2, i) * 1000);
        }
      } else {
        // Error lain, langsung throw
        throw error;
      }
    }
  }
  
  throw lastError || new Error('Failed to fetch video info');
}

// Helper function untuk extract text dari berbagai format
function extractText(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object') {
    // Coba berbagai property yang mungkin ada
    if (value.text) return extractText(value.text);
    if (value.runs && Array.isArray(value.runs)) {
      return value.runs.map((run: any) => extractText(run)).join('');
    }
    if (value.simpleText) return value.simpleText;
    // Jika object tapi tidak ada property yang dikenal, coba toString
    const str = String(value);
    return str === '[object Object]' ? '' : str;
  }
  return String(value);
}

export async function getYouTubeMetadata(url: string): Promise<YouTubeMetadata | null> {
  try {
    const info = await getVideoInfo(url);
    const videoId = extractVideoId(url)!;
    
    console.log(`[YouTube] Parsing metadata for ${videoId}`);
    
    // Ambil data dari basic_info
    const basicInfo = info.basic_info as any;
    
    // Validate basic_info exists
    if (!basicInfo) {
      console.error('[YouTube] basic_info is null or undefined');
      return null;
    }
    
    // Debug: log raw data types
    console.log(`[YouTube] Raw data types - title: ${typeof basicInfo.title}, author: ${typeof basicInfo.author}, duration: ${typeof basicInfo.duration}`);
    
    // Title - extract dengan helper function
    const title = extractText(basicInfo.title);
    if (!title || title === 'Unknown Title') {
      console.warn(`[YouTube] Failed to extract title, raw value:`, basicInfo.title);
    }
    
    // Author/Channel - coba berbagai sumber
    let channel = extractText(basicInfo.author);
    if (!channel && basicInfo.channel?.name) {
      channel = extractText(basicInfo.channel.name);
    }
    if (!channel) {
      console.warn(`[YouTube] Failed to extract channel, raw author:`, basicInfo.author, 'raw channel:', basicInfo.channel);
      channel = 'Unknown Channel';
    }
    
    const durationSeconds = Number(basicInfo.duration) || 0;
    if (durationSeconds === 0) {
      console.warn(`[YouTube] Duration is 0, raw value:`, basicInfo.duration);
    }
    
    // Thumbnail - ambil yang terbesar
    let thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    if (basicInfo.thumbnail && Array.isArray(basicInfo.thumbnail) && basicInfo.thumbnail.length > 0) {
      // Ambil thumbnail terakhir (biasanya yang terbesar)
      const lastThumbnail = basicInfo.thumbnail[basicInfo.thumbnail.length - 1];
      thumbnail = lastThumbnail.url || thumbnail;
    }
    
    // Description
    const description = extractText(basicInfo.short_description);

    const finalTitle = title || 'Unknown Title';
    const finalChannel = channel || 'Unknown Channel';
    
    console.log(`[YouTube] Metadata parsed - Title: "${finalTitle}", Channel: "${finalChannel}", Duration: ${durationSeconds}s`);

    // Validate before returning - hanya reject jika SEMUA field kosong DAN tidak ada thumbnail
    if (finalTitle === 'Unknown Title' && finalChannel === 'Unknown Channel' && durationSeconds === 0 && !thumbnail) {
      console.error('[YouTube] All metadata fields are empty, something went wrong');
      console.error('[YouTube] basic_info keys:', Object.keys(basicInfo));
      return null;
    }

    // Log success jika ada minimal 1 field yang valid
    if (finalTitle !== 'Unknown Title' || finalChannel !== 'Unknown Channel' || durationSeconds > 0) {
      console.log(`[YouTube] ✓ Metadata extracted successfully`);
    }

    return {
      videoId,
      title: finalTitle,
      channel: finalChannel,
      thumbnail,
      duration: formatDuration(durationSeconds),
      description,
    };
  } catch (error: any) {
    console.error('[YouTube] Error fetching YouTube metadata:', error.message);
    console.error('[YouTube] Error stack:', error.stack);
    return null;
  }
}

export async function getYouTubeTranscript(url: string): Promise<YouTubeTranscript | null> {
  try {
    const info = await getVideoInfo(url);
    
    console.log(`[YouTube] Attempting to fetch transcript for video`);
    
    // Coba ambil transkrip
    let transcriptData;
    try {
      transcriptData = await info.getTranscript();
      console.log(`[YouTube] Successfully fetched transcript`);
    } catch (transcriptError: any) {
      console.error('[YouTube] Error getting transcript:', transcriptError.message);
      
      // Jika gagal, cek apakah ada captions tersedia
      try {
        const captions = info.captions;
        console.log(`[YouTube] Checking available captions...`);
        
        if (captions && captions.caption_tracks && captions.caption_tracks.length > 0) {
          console.log(`[YouTube] Found ${captions.caption_tracks.length} caption tracks`);
          
          // Coba ambil caption track pertama yang tersedia
          const track = captions.caption_tracks[0];
          console.log(`[YouTube] Trying caption track: ${track.language_code}`);
          
          // Fetch caption URL dan parse manually
          const captionUrl = track.base_url;
          if (captionUrl) {
            // youtubei.js akan handle fetching caption
            transcriptData = await info.getTranscript();
          }
        } else {
          console.log(`[YouTube] No caption tracks available`);
          return null;
        }
      } catch (fallbackError: any) {
        console.error('[YouTube] Fallback transcript fetch failed:', fallbackError.message);
        return null;
      }
    }
    
    if (!transcriptData) {
      console.log(`[YouTube] No transcript data available`);
      return null;
    }

    const segments = transcriptData.transcript?.content?.body?.initial_segments?.map((segment: any) => ({
      text: segment.snippet?.text || '',
      start: segment.start_ms / 1000,
      duration: segment.end_ms / 1000 - segment.start_ms / 1000,
    })) || [];

    if (segments.length === 0) {
      console.log(`[YouTube] No segments found in transcript`);
      return null;
    }

    const fullText = segments.map((s: any) => s.text).join(' ');
    console.log(`[YouTube] Successfully parsed transcript with ${segments.length} segments`);

    return {
      text: fullText,
      segments,
    };
  } catch (error: any) {
    console.error('[YouTube] Error fetching YouTube transcript:', error.message);
    return null;
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
