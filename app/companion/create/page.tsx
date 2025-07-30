import { Metadata } from "next";
import CompanionCreateForm from "./components/CompanionCreateForm";

export const metadata: Metadata = {
  title: "創建您的陪伴者檔案 | 迷你教學",
  description:
    "加入我們合格的兒童陪伴者社群。創建您的檔案並與尋求教育支援的家庭建立聯繫。",
};

export default function CompanionCreatePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              創建您的陪伴者檔案
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              加入我們合格的兒童陪伴者社群
            </p>
            <p className="text-gray-500">
              填寫下面的表格創建您的陪伴者檔案。所有資訊將在您的檔案上線前進行審核。
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
