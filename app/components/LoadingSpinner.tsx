import Image from "next/image";

interface LoadingSpinnerProps {
  message?: string;
  backdrop?: "light" | "dark";
}

export default function LoadingSpinner({
  message = "加载中",
  backdrop = "dark",
}: LoadingSpinnerProps) {
  const backdropClass =
    backdrop === "dark"
      ? "bg-black/70 backdrop-blur-sm"
      : "bg-white/95 backdrop-blur-sm";

  return (
    <div
      className={`fixed inset-0 ${backdropClass} flex items-center justify-center z-50 p-4`}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-6 min-w-[320px] border border-gray-100">
        {/* Logo with subtle animation */}
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Image
              src="/miniTeach.png"
              alt="MiniTeach Logo"
              width={150}
              height={75}
              className="h-16 w-auto animate-pulse"
              priority
            />
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-lg blur-md animate-pulse"></div>
          </div>
        </div>

        {/* Clean loading dots */}
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div 
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" 
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div 
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" 
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {message}
          </h3>
          <p className="text-sm text-gray-600">为您准备最优质的服务...</p>
        </div>
      </div>
    </div>
  );
}
