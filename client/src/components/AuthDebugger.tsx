import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { apiClient } from '../lib/apiClient';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchCurrentUser } from '../store/userSlice';

export function AuthDebugger() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);

  const testAuth = async () => {
    setLoading(true);
    const info: any = {};

    try {
      // 1. Check Supabase session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      info.supabaseSession = {
        exists: !!session,
        user: session?.user
          ? {
              id: session.user.id,
              email: session.user.email,
              emailConfirmed: session.user.email_confirmed_at !== null,
            }
          : null,
        accessToken: session?.access_token ? 'Present' : 'Missing',
        error: sessionError?.message || null,
      };

      // 2. Test direct API call
      try {
        const userResponse = await apiClient.getCurrentUser();
        info.apiCall = {
          success: true,
          data: userResponse,
        };
      } catch (apiError: any) {
        info.apiCall = {
          success: false,
          error: apiError.message,
          status: apiError.status,
          response: apiError.response,
        };
      }

      // 3. Show Redux state
      info.reduxState = userState;

      setDebugInfo(info);
    } catch (error: any) {
      info.generalError = error.message;
      setDebugInfo(info);
    }

    setLoading(false);
  };

  const testFetchCurrentUser = () => {
    dispatch(fetchCurrentUser());
  };

  const clearDebugInfo = () => {
    setDebugInfo(null);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 mb-4">
      <h3 className="text-lg font-bold mb-3">Authentication Debugger</h3>

      <div className="space-x-2 mb-4">
        <button
          onClick={testAuth}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Auth State'}
        </button>

        <button
          onClick={testFetchCurrentUser}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Test Redux Fetch User
        </button>

        <button
          onClick={clearDebugInfo}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>

      {debugInfo && (
        <div className="bg-white p-4 rounded border">
          <h4 className="font-semibold mb-2">Debug Information:</h4>
          <pre className="text-xs overflow-auto max-h-96 bg-gray-100 p-2 rounded">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
