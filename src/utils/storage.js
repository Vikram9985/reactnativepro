import AsyncStorage from "@react-native-async-storage/async-storage";

const PRODUCTS_KEY = "novaloid_products";
const CART_KEY = "novaloid_cart";

export async function loadAppState() {
  try {
    const productsValue = await AsyncStorage.getItem(PRODUCTS_KEY);
    const cartValue = await AsyncStorage.getItem(CART_KEY);
    return {
      products: productsValue ? JSON.parse(productsValue) : [],
      cart: cartValue ? JSON.parse(cartValue) : []
    };
  } catch (error) {
    console.warn("Failed to load storage", error);
    return { products: [], cart: [] };
  }
}

export async function saveAppState({ products, cart }) {
  try {
    await AsyncStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn("Failed to save storage", error);
  }
}
