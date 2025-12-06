import { Metadata } from "next";
import CompanionCreateForm from "./components/CompanionCreateForm";
import CreatePageHeader from "./CreatePageHeader";

export const metadata: Metadata = {
  title: "Create Companion Profile | MiniTeach",
  description:
    "Join our community of qualified child companions. Create your profile and connect with families seeking educational support.",
};

export default function CompanionCreatePage() {
  return (
    <div>
      {/* Header Section */}
      <CreatePageHeader />

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CompanionCreateForm />
      </div>
    </div>
  );
}
