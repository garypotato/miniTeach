"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

export function useScrollPrevention() {
  const { modalOpen, isLoading } = useSelector((state: RootState) => state.modal);

  useEffect(() => {
    if (modalOpen || isLoading) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [modalOpen, isLoading]);
}