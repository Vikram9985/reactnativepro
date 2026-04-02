import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeFromCart } from "../store/cartSlice";
import { decreaseProductQuantity } from "../store/productsSlice";

export default function CartScreen({ navigation }) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const products = useSelector((state) => state.products.items);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePurchase = () => {
    if (cart.length === 0) {
      Alert.alert("Cart is empty", "Add products to the cart first.");
      return;
    }

    const stockIssue = cart.find((item) => {
      const product = products.find((productItem) => productItem.barcode === item.barcode);
      return !product || product.quantity < item.quantity;
    });

    if (stockIssue) {
      Alert.alert("Stock issue", `Not enough inventory for ${stockIssue.name}. Please adjust quantity.`);
      return;
    }

    cart.forEach((item) => {
      dispatch(decreaseProductQuantity({ barcode: item.barcode, amount: item.quantity }));
    });
    dispatch(clearCart());
    Alert.alert("Purchase complete", "Inventory updated and cart cleared.");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950 px-4 py-4">
      <View className="mb-4">
        <Text className="text-3xl font-bold text-white">Billing Cart</Text>
        <Text className="mt-1 text-slate-300">Scan items or review your cart before purchase.</Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("Scanner", { mode: "cart" })}
        className="mb-4 rounded-2xl bg-sky-500 px-4 py-3 items-center"
      >
        <Text className="text-white font-semibold">Scan Product to Add</Text>
      </TouchableOpacity>

      <ScrollView className="flex-1 rounded-3xl bg-slate-900 p-4">
        {cart.length === 0 ? (
          <Text className="text-slate-400">Your cart is empty. Scan a product to add it.</Text>
        ) : (
          cart.map((item) => (
            <View key={item.barcode} className="mb-4 rounded-3xl border border-slate-800 bg-slate-950 p-4">
              <Text className="text-lg font-semibold text-white">{item.name}</Text>
              <Text className="mt-2 text-slate-300">Price: ${item.price.toFixed(2)}</Text>
              <Text className="mt-1 text-slate-300">Quantity: {item.quantity}</Text>
              <Text className="mt-1 text-slate-300">Subtotal: ${(item.price * item.quantity).toFixed(2)}</Text>
              <TouchableOpacity
                onPress={() => dispatch(removeFromCart(item.barcode))}
                className="mt-3 rounded-2xl bg-amber-500 px-4 py-2 items-center"
              >
                <Text className="text-white">Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <View className="mt-4 rounded-3xl bg-slate-900 p-4">
        <Text className="text-slate-300">Total</Text>
        <Text className="mt-2 text-3xl font-bold text-white">${totalPrice.toFixed(2)}</Text>
        <TouchableOpacity
          onPress={handlePurchase}
          className="mt-4 rounded-2xl bg-emerald-500 px-4 py-3 items-center"
        >
          <Text className="text-white font-semibold">Complete Purchase</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
