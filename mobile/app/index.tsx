import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-red-500 bg-black/10 font-bold text-lg p-5 rounded-lg">
        Edit app/index.tsx to edit this screen.
      </Text>
    </View>
  );
}
