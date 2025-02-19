import '~/global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, View } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { PortalHost } from '@rn-primitives/portal';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { Toggle, ToggleIcon } from '~/components/ui/toggle';
import { SunIcon, MoonIcon } from 'lucide-react-native';
import { useColorScheme } from 'react-native';

const LIGHT_THEME = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = React.useState(systemColorScheme === 'dark');

  React.useEffect(() => {
    setAndroidNavigationBar(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <ThemeProvider value={isDarkMode ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Top Bar (Fixed Position) */}
      <View style={{ position: 'absolute', top: 50, right: 20, zIndex: 10 }}>
        <Toggle
          pressed={isDarkMode}
          onPressedChange={setIsDarkMode}
          aria-label="Toggle Theme"
          variant="outline"
          style={{
            backgroundColor: isDarkMode ? '#333' : '#eee',
            padding: 10,
            borderRadius: 20,
          }}
        >
          <ToggleIcon icon={isDarkMode ? MoonIcon : SunIcon} size={20} color={isDarkMode ? '#660094' : '#660094'} />
        </Toggle>
      </View>

      {/* Navigation */}
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="middle" options={{ title: "Middle School" }} />
        <Stack.Screen name="high" options={{ title: "High School" }} />
      </Stack>

      <PortalHost />
    </ThemeProvider>
  );
}
