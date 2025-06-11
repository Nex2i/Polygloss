import { useMutation } from '@tanstack/react-query';

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
  // For now, we'll use a placeholder token. In a real app, this would come from auth state
  const token = 'placeholder-jwt-token';

  const response = await fetch(`${API_BASE_URL}/api/elevenlabs/signed-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to get signed URL: ${response.statusText}`);
  }

  return response.json();
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
