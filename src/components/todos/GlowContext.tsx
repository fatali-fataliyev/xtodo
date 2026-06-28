import React, { createContext, useContext, useEffect } from "react";
import {
  SharedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const GlowContext = createContext<SharedValue<number> | null>(null);

export const GlowProvider = ({ children }: { children: React.ReactNode }) => {
  const glowProgress = useSharedValue(0);

  useEffect(() => {
    glowProgress.value = withRepeat(
      withTiming(1, { duration: 2500 }),
      -1,
      true,
    );
  }, []);

  return (
    <GlowContext.Provider value={glowProgress}>{children}</GlowContext.Provider>
  );
};

export const useGlowContext = () => {
  const context = useContext(GlowContext);
  if (!context) {
    throw new Error("useGlowContext must be used within a GlowProvider");
  }
  return context;
};
