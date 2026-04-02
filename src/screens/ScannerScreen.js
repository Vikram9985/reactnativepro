import { useEffect, useState } from "react";
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";

export default function ScannerScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const { mode } = route.params;
  const products = useSelector((state) => state.products.items);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [foundProduct, setFoundProduct] = useState(null);
  const [message, setMessage] = useState("Point the camera at a barcode or QR code.");

  useEffect(() => {
    async function requestPermission() {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    }
    requestPermission();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    const product = products.find((item) => item.barcode === data);
    if (product) {
      setFoundProduct(product);
      setMessage("Product found.");
    } else {
      setFoundProduct(null);
      setMessage("Unknown barcode / QR code.");
    }
  };

  const handleAddToCart = () => {
    if (!foundProduct) {
      return;
    }
    if (foundProduct.quantity <= 0) {
      Alert.alert("Out of stock", "This product has no quantity available.");
      return;
    }
    dispatch(addToCart({ ...foundProduct, quantity: 1 }));
    Alert.alert("Added to cart", `${foundProduct.name} was added to your cart.`);
    setScanned(false);
    setMessage("Scan another barcode or QR code.");
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-950">
        <Text className="text-white">Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-slate-950 px-4">
        <Text className="text-white text-center">Camera access is required to scan barcodes and QR codes.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="h-80 overflow-hidden rounded-b-3xl">
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          className="h-full w-full"
        />
      </View>
      <View className="flex-1 px-4 py-4">
        <Text className="text-white text-lg font-semibold">{message}</Text>

        {foundProduct && (
          <View className="mt-4 rounded-3xl bg-slate-900 p-4">
            <Text className="text-xl font-semibold text-white">{foundProduct.name}</Text>
            <Text className="mt-2 text-slate-300">Barcode: {foundProduct.barcode}</Text>
            <Text className="mt-1 text-slate-300">Price: ${foundProduct.price.toFixed(2)}</Text>
            <Text className="mt-1 text-slate-300">Available: {foundProduct.quantity}</Text>
          </View>
        )}

        {scanned && foundProduct && mode === "cart" && (
          <TouchableOpacity
            onPress={handleAddToCart}
            className="mt-4 rounded-2xl bg-emerald-500 px-4 py-3 items-center"
          >
            <Text className="text-white font-semibold">Add to Cart</Text>
          </TouchableOpacity>
        )}

        {scanned && (
          <TouchableOpacity
            onPress={() => {
              setScanned(false);
              setMessage("Point the camera at a barcode or QR code.");
            }}
            className="mt-4 rounded-2xl bg-slate-700 px-4 py-3 items-center"
          >
            <Text className="text-white font-semibold">Scan Again</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4 rounded-2xl bg-slate-600 px-4 py-3 items-center"
        >
          <Text className="text-white">Back to Inventory</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
