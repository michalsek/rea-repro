import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

function someInternalWorklet<T extends number[]>(s: T): T {
  "worklet";

  return s.map((v) => v * 2) as T;
}

export default function App() {
  const arraySV = useSharedValue<number[]>([]);

  useEffect(() => {
    arraySV.modify((arr) => {
      "worklet";

      arr.push(Math.random());

      // using number[] directly causes the function to warn of TS error
      // this happens also when the internal method is not using a generic type (just number[])
      return someInternalWorklet<number[]>(arr);
    });

    arraySV.modify((arr) => {
      "worklet";

      arr.push(Math.random());

      // If internal function is generic and can infer <T extends Value> (here T = number[]),
      // then no TS error is raised
      return someInternalWorklet(arr);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
