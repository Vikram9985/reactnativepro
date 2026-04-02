import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: []
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      state.items = action.payload;
    },
    addToCart(state, action) {
      const payload = action.payload;
      const existing = state.items.find((item) => item.barcode === payload.barcode);
      const quantity = typeof payload.quantity === "number" ? payload.quantity : 1;
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          barcode: payload.barcode,
          name: payload.name,
          price: payload.price,
          quantity
        });
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.barcode !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    }
  }
});

export const { setCart, addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
