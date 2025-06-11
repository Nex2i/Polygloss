import { createFileRoute } from '@tanstack/react-router';
import { UserProfile } from '../../components/UserProfile';

export const Route = createFileRoute('/_app/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">User Profile</h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
            <UserProfile showFullProfile={true} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
                <div className="font-medium text-blue-900">Update Profile</div>
                <div className="text-sm text-blue-700">
                  Change your name, email, or profile picture
                </div>
              </button>

              <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
                <div className="font-medium text-green-900">Learning Progress</div>
                <div className="text-sm text-green-700">View your language learning statistics</div>
              </button>

              <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
                <div className="font-medium text-purple-900">Account Settings</div>
                <div className="text-sm text-purple-700">
                  Manage notifications and privacy settings
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
