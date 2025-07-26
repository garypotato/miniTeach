import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  modalOpen: boolean;
  modalType?: "loading" | "filter" | "confirmation";
  modalData?: Record<string, unknown>;
  isLoading: boolean;
  loadingMessage?: string;
}

const initialState: ModalState = {
  modalOpen: false,
  modalType: undefined,
  modalData: undefined,
  isLoading: false,
  loadingMessage: undefined,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{
        type: "loading" | "filter" | "confirmation";
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
    },
    setLoading: (
      state,
      action: PayloadAction<{ loading: boolean; message?: string }>
    ) => {
      state.isLoading = action.payload.loading;
      state.loadingMessage = action.payload.message;
    },
  },
});

export const { openModal, closeModal, setLoading } = modalSlice.actions;
export default modalSlice.reducer;
