import { getCompanionProfile } from "@/app/actions/profile";
import ProfilePageClient from "./ProfilePageClient";

export default async function CompanionProfile() {
  try {
    const profile = await getCompanionProfile();
    return <ProfilePageClient profile={profile} />;
  } catch (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex">
            <svg
              className="w-5 h-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="ml-2 text-sm text-red-700">
              {error instanceof Error
                ? error.message
                : "获取档案信息时发生错误"}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
