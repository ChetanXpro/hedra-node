import {  AxiosInstance } from 'axios';
import { AvatarProjectItem } from '../types';



export async function pollForCompletion(
    axiosInstance: AxiosInstance,
    projectId: string,
    onProgress?: (status: string) => void,
    interval = 5000,
    maxAttempts = 60
  ): Promise<AvatarProjectItem> {
    let attempts = 0;
    while (attempts < maxAttempts) {
      const response = await axiosInstance.get<AvatarProjectItem>(`/v1/projects/${projectId}`);
      const project = response.data;
      
      if (onProgress) {
        onProgress(project.status || 'In Progress');
      }
  
      if (project.status === 'Completed') {
        return project;
      }
      if (project.status === 'Failed') {
        throw new Error(`Project failed: ${project.errorMessage}`);
      }
  
      await new Promise(resolve => setTimeout(resolve, interval));
      attempts++;
    }
    throw new Error('Polling timed out');
  }
  