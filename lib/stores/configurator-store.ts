"use client";

import { create } from "zustand";

export type RoomType = "Office" | "Conference Room" | "Home Studio" | "Other";
export type CeilingType = "Hard Ceiling" | "Acoustic Tile" | "Open Ceiling";
export type FloorType = "Hard Floor" | "Carpet" | "Mixed";
export type WindowSize = "None" | "Small" | "Large";

export type RoomDetails = {
  roomType: RoomType;
  length: number;
  width: number;
  height: number;
  ceilingType: CeilingType;
  floorType: FloorType;
  windows: WindowSize;
};

export type QuoteItem = {
  id: string;
  productName: string;
  variant: string;
  placement: string;
  placementNote?: string;
  quantity: number;
  unitLabel: string;
  unitPrice: number;
  thumbnail: "wood" | "oak" | "cloud" | "baffle" | "corner" | "bass";
  imageUrl?: string | null;
};

export type LeadDetails = {
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  projectName?: string;
  additionalNotes?: string;
  marketingConsent: boolean;
};

type ConfiguratorState = {
  roomDetails: RoomDetails | null;
  selectedProducts: QuoteItem[];
  hasProductSelection: boolean;
  leadDetails: LeadDetails | null;
  localSubmissionMessage: string | null;
  setRoomDetails: (details: RoomDetails) => void;
  setSelectedProducts: (products: QuoteItem[]) => void;
  addSelectedProduct: (product: QuoteItem) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
  setLeadDetails: (details: LeadDetails) => void;
  setLocalSubmissionMessage: (message: string | null) => void;
  resetConfigurator: () => void;
};

export const defaultRoomDetails: RoomDetails = {
  roomType: "Office",
  length: 20,
  width: 16,
  height: 10,
  ceilingType: "Hard Ceiling",
  floorType: "Hard Floor",
  windows: "Large"
};

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  roomDetails: null,
  selectedProducts: [],
  hasProductSelection: false,
  leadDetails: null,
  localSubmissionMessage: null,
  setRoomDetails: (details) =>
    set({ roomDetails: details, selectedProducts: [], hasProductSelection: false }),
  setSelectedProducts: (products) =>
    set({ selectedProducts: products, hasProductSelection: true }),
  addSelectedProduct: (product) =>
    set((state) => {
      const existingProduct = state.selectedProducts.find(
        (selectedProduct) => selectedProduct.id === product.id
      );

      if (existingProduct) {
        return {
          hasProductSelection: true,
          selectedProducts: state.selectedProducts.map((selectedProduct) =>
            selectedProduct.id === product.id
              ? {
                  ...selectedProduct,
                  quantity: selectedProduct.quantity + product.quantity
                }
              : selectedProduct
          )
        };
      }

      return {
        hasProductSelection: true,
        selectedProducts: [...state.selectedProducts, product]
      };
    }),
  updateProductQuantity: (productId, quantity) =>
    set((state) => {
      const nextProducts =
        quantity <= 0
          ? state.selectedProducts.filter((product) => product.id !== productId)
          : state.selectedProducts.map((product) =>
              product.id === productId ? { ...product, quantity } : product
            );

      return {
        hasProductSelection: true,
        selectedProducts: nextProducts
      };
    }),
  setLeadDetails: (details) =>
    set({
      leadDetails: details
    }),
  setLocalSubmissionMessage: (message) =>
    set({
      localSubmissionMessage: message
    }),
  resetConfigurator: () =>
    set({
      roomDetails: null,
      selectedProducts: [],
      hasProductSelection: false,
      leadDetails: null,
      localSubmissionMessage: null
    })
}));
