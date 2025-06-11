import { useMutation } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface SignedUrlRequest {
  lessonLevel?: number;
}

interface SignedUrlResponse {
  signedUrl: string;
  agentId: string;
  lessonLevel?: number;
  expiresAt: string;
}

async function fetchSignedUrl(request: SignedUrlRequest): Promise<SignedUrlResponse> {
  const result = await apiClient<SignedUrlResponse>(`${API_BASE_URL}/api/elevenlabs/signed-url`, {
    method: 'POST',
    body: JSON.stringify(request),
  });

  if (!result) {
    throw new Error('Failed to get signed URL: API returned null response');
  }

  return result;
}

export function useElevenLabsSignedUrl() {
  const mutation = useMutation({
    mutationFn: fetchSignedUrl,
    onError: (error) => {
      console.error('❌ [ELEVEN_LABS] Failed to get signed URL:', error);
    },
    onSuccess: (data) => {
      console.log('🟢 [ELEVEN_LABS] Successfully got signed URL:', {
        hasSignedUrl: !!data.signedUrl,
        agentId: data.agentId,
        lessonLevel: data.lessonLevel,
        expiresAt: data.expiresAt,
      });
    },
  });

  return {
    // Expose the full mutation object
    ...mutation,

    // Convenience properties for easier access
    signedUrlData: mutation.data,
    hasSignedUrl: !!mutation.data?.signedUrl,
    agentId: mutation.data?.agentId,
    lessonLevel: mutation.data?.lessonLevel,
    expiresAt: mutation.data?.expiresAt,

    // Cleaner function names
    fetchSignedUrl: mutation.mutate,
    fetchSignedUrlAsync: mutation.mutateAsync,
  };
}
