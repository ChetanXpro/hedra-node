export type AspectRatio = '1:1' | '16:9' | '9:16';
export type AudioSource = 'tts' | 'audio';

export interface AvatarImageInput {
  seed?: number;
  prompt: string;
}

export interface GenerateTalkingAvatarRequestBody {
  text?: string;
  voiceId?: string | null;
  voiceUrl?: string | null;
  avatarImage?: string | null;
  aspectRatio?: AspectRatio;
  audioSource?: AudioSource;
  avatarImageInput?: AvatarImageInput | null;
}

export interface ProjectInitializationResponseBody {
  jobId: string;
}

export interface AvatarProjectItem {
  id?: string | null;
  createdAt?: string | null;
  username?: string | null;
  videoUrl?: string | null;
  avatarImageUrl?: string | null;
  aspectRatio: AspectRatio;
  text?: string | null;
  voiceId?: string | null;
  voiceUrl?: string | null;
  userId?: string | null;
  jobType?: string | null;
  status?: string | null;
  stage?: string | null;
  progress?: number | null;
  errorMessage?: string | null;
  audioSource?: string | null;
  avatarImageInput?: Record<string, unknown> | null;
  shared?: boolean;
}

export interface GetUserAvatarJobsResponse {
  projects: AvatarProjectItem[];
}

export interface UploadResponseBody {
  url: string;
}

export interface Voice {
  voice_id: string;
  name?: string | null;
  description?: string | null;
  labels?: Record<string, string> | null;
  category?: string | null;
  preview_url?: string | null;
  premium: boolean;
}

export interface VoicesResponseBody {
  supported_voices: Voice[];
}

export interface HedraOptions {
  baseUrl?: string;
  customHeaders?: Record<string, string>;
}