"use client";

import { useAppDispatch } from "@/app/store/hooks";
import { setLoading, clearLoading } from "@/app/store/modalSlice";
import { useRouter } from "next/navigation";

export function usePageLoading() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const showLoading = (message?: string) => {
    dispatch(setLoading({ loading: true, message: message || "页面加载中..." }));
  };

  const hideLoading = () => {
    dispatch(clearLoading());
  };

  const navigateWithLoading = (href: string, message?: string) => {
    showLoading(message || "页面跳转中...");
    router.push(href);
  };

  const refreshWithLoading = (message?: string) => {
    showLoading(message || "页面刷新中...");
    router.refresh();
  };

  return {
    showLoading,
    hideLoading,
    navigateWithLoading,
    refreshWithLoading,
  };
}