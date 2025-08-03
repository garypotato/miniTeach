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
        {/* Logo with animation */}
        <div className="flex items-center space-x-3 mb-2">
          <div className="text-4xl animate-bounce">🎓👶</div>
          <div className="flex flex-col">
            <span
              className="text-xl font-bold leading-tight"
              style={{ color: "#47709B" }}
            >
              学霸带娃
            </span>
            <span
              className="text-sm font-medium leading-tight opacity-70"
              style={{ color: "#47709B" }}
            >
              MiniTeach
            </span>
          </div>
        </div>

        {/* Loading spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-500"></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-300 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
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
