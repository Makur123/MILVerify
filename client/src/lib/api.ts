import { authService } from "./auth";

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `/api${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authService.getAuthHeaders(),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }
  
  return response;
}

export async function uploadFile(endpoint: string, file: File, additionalData?: Record<string, any>) {
  const formData = new FormData();
  formData.append('file', file);
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const response = await fetch(`/api${endpoint}`, {
    method: 'POST',
    headers: {
      ...authService.getAuthHeaders(),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Upload failed! status: ${response.status}`);
  }

  return response.json();
}
