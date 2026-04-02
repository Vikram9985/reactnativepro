import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: []
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action) {
      state.items = action.payload;
    },
    addProduct(state, action) {
      state.items.push(action.payload);
    },
    decreaseProductQuantity(state, action) {
      const { barcode, amount } = action.payload;
      const product = state.items.find((item) => item.barcode === barcode);
      if (product) {
        product.quantity = Math.max(0, product.quantity - amount);
      }
    }
  }
});

export const { setProducts, addProduct, decreaseProductQuantity } = productsSlice.actions;
export default productsSlice.reducer;
