import { ScrollView, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export default function ProductListScreen({ navigation }) {
  const products = useSelector((state) => state.products.items);

  return (
    <SafeAreaView className="flex-1 bg-slate-950 px-4 py-4">
      <View className="mb-4">
        <Text className="text-3xl font-bold text-white">Inventory Management</Text>
        <Text className="mt-1 text-slate-300">Add items, scan barcodes, and complete billing.</Text>
      </View>

      <View className="mb-4 flex-row gap-3">
        <TouchableOpacity
          onPress={() => navigation.navigate("AddProduct")}
          className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3 items-center"
        >
          <Text className="text-white font-semibold">Add Product</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Scanner", { mode: "view" })}
          className="flex-1 rounded-2xl bg-sky-500 px-4 py-3 items-center"
        >
          <Text className="text-white font-semibold">Scan Product</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("Cart")}
        className="mb-4 rounded-2xl bg-slate-700 px-4 py-3 items-center"
      >
        <Text className="text-white font-semibold">Open Billing / Cart</Text>
      </TouchableOpacity>

      <ScrollView className="flex-1 rounded-3xl bg-slate-900 p-4">
        {products.length === 0 ? (
          <Text className="text-slate-400">No products yet. Add a product to get started.</Text>
        ) : (
          products.map((product) => (
            <View key={product.barcode} className="mb-4 rounded-3xl border border-slate-800 bg-slate-950 p-4 shadow-lg shadow-black/20">
              <Text className="text-lg font-semibold text-white">{product.name}</Text>
              <Text className="mt-2 text-slate-300">Barcode / QR: {product.barcode}</Text>
              <Text className="mt-1 text-slate-300">Price: ${product.price.toFixed(2)}</Text>
              <Text className="mt-1 text-slate-300">Quantity: {product.quantity}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
