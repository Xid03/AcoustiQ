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
  thumbnail: "wood" | "cloud" | "bass";
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
  leadDetails: LeadDetails | null;
  localSubmissionMessage: string | null;
  setRoomDetails: (details: RoomDetails) => void;
  setSelectedProducts: (products: QuoteItem[]) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
  setLeadDetails: (details: LeadDetails) => void;
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
  leadDetails: null,
  localSubmissionMessage: null,
  setRoomDetails: (details) => set({ roomDetails: details }),
  setSelectedProducts: (products) => set({ selectedProducts: products }),
  updateProductQuantity: (productId, quantity) =>
    set((state) => ({
      selectedProducts: state.selectedProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: Math.max(0, quantity) }
          : product
      )
    })),
  setLeadDetails: (details) =>
    set({
      leadDetails: details,
      localSubmissionMessage:
        "Quote request saved locally. Backend submission will be added in Step 9."
    }),
  resetConfigurator: () =>
    set({
      roomDetails: null,
      selectedProducts: [],
      leadDetails: null,
      localSubmissionMessage: null
    })
}));
