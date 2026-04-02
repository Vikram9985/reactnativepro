import { Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../store/productsSlice";

export default function AddProductScreen({ navigation }) {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [barcode, setBarcode] = useState("");

  const generateBarcode = () => {
    const newCode = `PNV-${Math.floor(100000 + Math.random() * 900000)}`;
    setBarcode(newCode);
  };

  const handleSave = () => {
    if (!name.trim() || !price.trim() || !quantity.trim()) {
      Alert.alert("Missing information", "Please fill in all fields.");
      return;
    }

    const numericPrice = Number(price);
    const numericQuantity = Number(quantity);
    const code = barcode.trim() || `PNV-${Date.now()}`;

    if (Number.isNaN(numericPrice) || numericPrice <= 0 || Number.isNaN(numericQuantity) || numericQuantity <= 0) {
      Alert.alert("Invalid values", "Price and quantity must be positive numbers.");
      return;
    }

    if (products.some((product) => product.barcode === code)) {
      Alert.alert("Duplicate code", "This barcode / QR code already exists.");
      return;
    }

    dispatch(
      addProduct({
        name: name.trim(),
        price: numericPrice,
        quantity: numericQuantity,
        barcode: code
      })
    );

    Alert.alert("Product added", `${name} has been added to inventory.`, [
      { text: "OK", onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950 px-4 py-4">
      <ScrollView>
        <Text className="text-3xl font-bold text-white mb-3">Add Product</Text>
        <View className="mb-4 rounded-3xl bg-slate-900 p-4">
          <Text className="text-slate-300 mb-2">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Product name"
            placeholderTextColor="#94a3b8"
            className="mb-4 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
          <Text className="text-slate-300 mb-2">Price</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="12.99"
            placeholderTextColor="#94a3b8"
            keyboardType="decimal-pad"
            className="mb-4 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
          <Text className="text-slate-300 mb-2">Quantity</Text>
          <TextInput
            value={quantity}
            onChangeText={setQuantity}
            placeholder="5"
            placeholderTextColor="#94a3b8"
            keyboardType="number-pad"
            className="mb-4 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
          <Text className="text-slate-300 mb-2">Barcode / QR Code</Text>
          <TextInput
            value={barcode}
            onChangeText={setBarcode}
            placeholder="Enter or generate code"
            placeholderTextColor="#94a3b8"
            className="mb-4 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          />
          <TouchableOpacity
            onPress={generateBarcode}
            className="mb-4 rounded-2xl bg-sky-500 px-4 py-3 items-center"
          >
            <Text className="text-white font-semibold">Generate Code</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            className="rounded-2xl bg-emerald-500 px-4 py-3 items-center"
          >
            <Text className="text-white font-semibold">Save Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
