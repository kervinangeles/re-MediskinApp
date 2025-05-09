import { Stack } from 'expo-router';
import React from 'react';

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

// Don't touch this file unless you know what you're doing
// This is the root layout for your (screens) tab app thanks.