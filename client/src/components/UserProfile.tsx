import React from 'react';
import { useUser } from '../hooks/useUser';

interface UserProfileProps {
  showFullProfile?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ showFullProfile = false }) => {
  const { user, supabaseUser, loading, error, displayName, avatarUrl, emailVerified } = useUser();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm">Error loading user data: {error}</div>;
  }

  if (!user) {
    return <div className="text-gray-500 text-sm">No user data available</div>;
  }

  if (!showFullProfile) {
    // Compact version for navigation/header
    return (
      <div className="flex items-center space-x-2">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm font-medium">{displayName}</span>
      </div>
    );
  }

  // Full profile version
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      <div className="flex items-center space-x-4 mb-4">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-medium">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{displayName}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account ID</label>
          <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">{user.id}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
          <p className="text-sm text-gray-900">
            {new Date(user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
          <p className="text-sm text-gray-900">
            {new Date(user.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {supabaseUser && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Status</label>
            <p className="text-sm">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {emailVerified ? 'Verified' : 'Pending Verification'}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
