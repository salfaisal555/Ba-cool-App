import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Initial state for cart items
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      state.items.push(action.payload);
    },
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    removeItem(state, action) {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },
    clearCart(state) {
      state.items = []; // Kosongkan semua item di keranjang
    },
  },
});

export const { addToCart, updateQuantity, removeItem, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
