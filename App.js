import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./src/store/store";
import ProductListScreen from "./src/screens/ProductListScreen";
import AddProductScreen from "./src/screens/AddProductScreen";
import CartScreen from "./src/screens/CartScreen";
import ScannerScreen from "./src/screens/ScannerScreen";
import { loadAppState, saveAppState } from "./src/utils/storage";
import { setProducts } from "./src/store/productsSlice";
import { setCart } from "./src/store/cartSlice";

const Stack = createNativeStackNavigator();

function AppContent() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const cart = useSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      const saved = await loadAppState();
      if (saved.products) {
        dispatch(setProducts(saved.products));
      }
      if (saved.cart) {
        dispatch(setCart(saved.cart));
      }
      setLoading(false);
    }
    bootstrap();
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      saveAppState({ products, cart });
    }
  }, [products, cart, loading]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#0f172a" }, headerTintColor: "#f8fafc" }}>
        <Stack.Screen name="Products" component={ProductListScreen} options={{ title: "Inventory" }} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: "Add Product" }} />
        <Stack.Screen name="Cart" component={CartScreen} options={{ title: "Billing" }} />
        <Stack.Screen name="Scanner" component={ScannerScreen} options={{ title: "Scan Product" }} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
