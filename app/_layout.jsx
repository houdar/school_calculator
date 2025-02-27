import '~/global.css';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as React from 'react';
import { NAV_THEME } from '~/lib/constants';
import { PortalHost } from '@rn-primitives/portal';
export { ErrorBoundary } from 'expo-router';
import Toast from "react-native-toast-message"

const LIGHT_THEME = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};

export default function RootLayout() {

  return (
    <ThemeProvider value={LIGHT_THEME}>
      {/* Navigation */}
      <Stack>
        <Stack.Screen name="index" options={{ title: "Niveau" }} />
        <Stack.Screen name="middle" options={{ title: "Middle School" }} />
        <Stack.Screen name="high" options={{ title: "High School" }} />
        <Toast/>
      </Stack>

      <PortalHost />
    </ThemeProvider>
  );
}
