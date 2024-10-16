import axios, { AxiosError, AxiosInstance } from 'axios';
import FormData from 'form-data';
import { HedraOptions, GenerateTalkingAvatarRequestBody, ProjectInitializationResponseBody, AvatarProjectItem, GetUserAvatarJobsResponse, UploadResponseBody, VoicesResponseBody, AspectRatio } from './types';
import { Readable } from 'stream';
import fs from 'fs';
import { pollForCompletion } from './utils/api';
import { getFormLength } from './utils/formUtils';


export class HedraClient {

  private readonly apiKey: string;
  private readonly baseUrl: string;

  private readonly axiosInstance: AxiosInstance;

  constructor(apiKey: string, options?: HedraOptions) {
    this.apiKey = apiKey;
    this.baseUrl = options?.baseUrl || 'https://mercury.dev.dream-ai.com/api';
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-API-KEY': this.apiKey,
        // 'Content-Type': 'application/json',
        ...options?.customHeaders,
      },
    });
  }

  async ping(): Promise<void> {
    await this.axiosInstance.get('/ping');
  }

  async getVoices(): Promise<VoicesResponseBody> {
    const response = await this.axiosInstance.get<VoicesResponseBody>('/v1/voices');
    return response.data;
  }


  async uploadAudio(file: Buffer | Readable, filename?: string): Promise<UploadResponseBody> {
    const form = new FormData();

    if (Buffer.isBuffer(file)) {
      form.append('file', file, { filename: filename });
    } else if (file instanceof Readable) {
      form.append('file', file, { filename: filename });
    } else {
      throw new Error('Invalid file type. Expected Buffer or Readable.');
    }


    try {
      const contentLength = await getFormLength(form);
      const response = await this.axiosInstance.post<UploadResponseBody>('/v1/audio', form, {
        headers: {
          ...form.getHeaders(),
          'Content-Length': contentLength,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 422) {
          console.error('Upload failed. Server response:', axiosError.response.data);
        }
      }
      throw error;
    }
  }

  async uploadImage(file: Buffer | Readable, aspectRatio?: AspectRatio, filename?: string): Promise<UploadResponseBody> {
    const form = new FormData();

    if (Buffer.isBuffer(file)) {
      form.append('file', file, { filename: filename });
    } else if (file instanceof Readable) {
      form.append('file', file, { filename: filename });
    } else {
      throw new Error('Invalid file type. Expected Buffer or Readable.');
    }


    try {
      const contentLength = await getFormLength(form);
      const response = await this.axiosInstance.post<UploadResponseBody>('/v1/portrait', form, {
        headers: {
          ...form.getHeaders(),
          'Content-Length': contentLength,
        },
        params: { aspect_ratio: aspectRatio },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 422) {
          console.error('Upload failed. Server response:', axiosError.response.data);
        }
      }
      throw error;
    }
  }


  async generateCharacter(payload: GenerateTalkingAvatarRequestBody): Promise<ProjectInitializationResponseBody> {
    try {


      const response = await this.axiosInstance.post<ProjectInitializationResponseBody>('/v1/characters', payload);
      return response.data;

    } catch (error) {

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 402) {
          throw new Error('You have reached your generation credit limit. Please upgrade your plan to continue generating characters.');
        }
      }
      throw error;

    }
  }

  async waitForProjectCompletion(
    projectId: string,
    onProgress?: (status: string) => void,
    interval = 5000,
    maxAttempts = 60
  ): Promise<AvatarProjectItem> {
    
    return pollForCompletion(this.axiosInstance, projectId, onProgress, interval, maxAttempts);

  }

  async getAllProjects(): Promise<GetUserAvatarJobsResponse> {

    const response = await this.axiosInstance.get<GetUserAvatarJobsResponse>('/v1/projects');
    
    return response.data;
  }

  async getProject(projectId: string): Promise<AvatarProjectItem> {
    const response = await this.axiosInstance.get<AvatarProjectItem>(`/v1/projects/${projectId}`);
    return response.data;
  }

  async deleteProject(projectId: string): Promise<void> {
    await this.axiosInstance.delete(`/v1/projects/${projectId}`);
  }

  async shareProject(projectId: string, shared: boolean): Promise<void> {

    await this.axiosInstance.post(`/v1/projects/${projectId}/sharing`, null, {
      params: { shared },
    });

  }

  async downloadVideo(videoUrl: string, outputPath: string): Promise<void> {

    const response = await this.axiosInstance.get(videoUrl, { responseType: 'stream' });
    const writer = fs.createWriteStream(outputPath);

    return new Promise((resolve, reject) => {
      (response.data as Readable).pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }
}