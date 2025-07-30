import { Metadata } from "next";
import CompanionCreateForm from "./components/CompanionCreateForm";

export const metadata: Metadata = {
  title: "Create Your Companion Profile | Mini-Teach",
  description:
    "Join our community of qualified child companions. Create your profile and connect with families looking for educational support.",
};

export default function CompanionCreatePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create Your Companion Profile
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Join our community of qualified child companions
            </p>
            <p className="text-gray-500">
              Fill out the form below to create your companion profile. All
              information will be reviewed before your profile goes live.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CompanionCreateForm />
      </div>
    </div>
  );
}
