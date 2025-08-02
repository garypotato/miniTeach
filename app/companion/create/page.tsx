import { Metadata } from "next";
import CompanionCreateForm from "./components/CompanionCreateForm";

export const metadata: Metadata = {
  title: "创建您的陪伴师档案 | 迷你教学",
  description:
    "加入我们合格的儿童陪伴师社群。创建您的档案并与寻求教育支持的家庭建立联系。",
};

export default function CompanionCreatePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              创建您的陪伴师档案
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              加入我们合格的儿童陪伴师社群
            </p>
            <p className="text-gray-500">
              填写下面的表格创建您的陪伴师档案。所有信息将在您的档案上线前进行审核。
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
