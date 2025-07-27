import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  modalOpen: boolean;
  modalType?: "loading" | "filter" | "confirmation" | "success";
  modalData?: Record<string, unknown>;
  isLoading: boolean;
  loadingMessage?: string;
  isSuccess: boolean;
  successMessage?: string;
  successAction?: () => void;
}

const initialState: ModalState = {
  modalOpen: false,
  modalType: undefined,
  modalData: undefined,
  isLoading: false,
  loadingMessage: undefined,
  isSuccess: false,
  successMessage: undefined,
  successAction: undefined,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{
        type: "loading" | "filter" | "confirmation" | "success";
        data?: Record<string, unknown>;
      }>
    ) => {
      state.modalOpen = true;
      state.modalType = action.payload.type;
      state.modalData = action.payload.data;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.modalType = undefined;
      state.modalData = undefined;
      state.isSuccess = false;
      state.successMessage = undefined;
      state.successAction = undefined;
    },
    setLoading: (
      state,
      action: PayloadAction<{ loading: boolean; message?: string }>
    ) => {
      state.isLoading = action.payload.loading;
      state.loadingMessage = action.payload.message;
    },
    setSuccess: (
      state,
      action: PayloadAction<{ success: boolean; message?: string; action?: () => void }>
    ) => {
      state.isSuccess = action.payload.success;
      state.successMessage = action.payload.message;
      state.successAction = action.payload.action;
    },
  },
});

export const { openModal, closeModal, setLoading, setSuccess } = modalSlice.actions;
export default modalSlice.reducer;
