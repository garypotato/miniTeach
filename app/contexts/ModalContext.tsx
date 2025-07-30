"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  // Modal state
  modalOpen: boolean;
  modalType?: "loading" | "filter" | "confirmation" | "success";
  modalData?: Record<string, unknown>;
  
  // Loading state
  isLoading: boolean;
  loadingMessage?: string;
  
  // Success state
  isSuccess: boolean;
  successMessage?: string;
  successAction?: () => void;
  
  // Actions
  openModal: (type: "loading" | "filter" | "confirmation" | "success", data?: Record<string, unknown>) => void;
  closeModal: () => void;
  setLoading: (loading: boolean, message?: string) => void;
  setSuccess: (success: boolean, message?: string, action?: () => void) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"loading" | "filter" | "confirmation" | "success" | undefined>();
  const [modalData, setModalData] = useState<Record<string, unknown> | undefined>();
  const [isLoading, setIsLoadingState] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();
  const [isSuccess, setIsSuccessState] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [successAction, setSuccessAction] = useState<(() => void) | undefined>();

  const openModal = (type: "loading" | "filter" | "confirmation" | "success", data?: Record<string, unknown>) => {
    setModalOpen(true);
    setModalType(type);
    setModalData(data);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(undefined);
    setModalData(undefined);
    setIsSuccessState(false);
    setSuccessMessage(undefined);
    setSuccessAction(undefined);
  };

  const setLoading = (loading: boolean, message?: string) => {
    setIsLoadingState(loading);
    setLoadingMessage(message);
  };

  const setSuccess = (success: boolean, message?: string, action?: () => void) => {
    setIsSuccessState(success);
    setSuccessMessage(message);
    setSuccessAction(() => action);
  };

  const value: ModalContextType = {
    modalOpen,
    modalType,
    modalData,
    isLoading,
    loadingMessage,
    isSuccess,
    successMessage,
    successAction,
    openModal,
    closeModal,
    setLoading,
    setSuccess,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}