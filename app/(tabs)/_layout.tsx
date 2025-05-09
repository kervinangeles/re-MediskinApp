import { Tabs } from 'expo-router';
import React from 'react';
import { Image, ImageSourcePropType, Platform, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';

// Import your custom icon images
const homeIconActive = require('../../assets/images/Home.png');
const homeIconInactive = require('../../assets/images/Home.png');
const profileIconActive = require('../../assets/images/profile.png');
const profileIconInactive = require('../../assets/images/profile.png');
const settingsIconActive = require('../../assets/images/Menu.png');
const settingsIconInactive = require('../../assets/images/Menu.png');
const cameraIconActive = require('../../assets/images/camera.png');
const cameraIconInactive = require('../../assets/images/camera.png');
const historyIconActive = require('../../assets/images/history.png');
const historyIconInactive = require('../../assets/images/history.png');

// Custom Icon component
interface CustomTabIconProps {
  source: ImageSourcePropType;
  focused: boolean;
}

function CustomTabIcon({ source, focused }: CustomTabIconProps) {
  return (
    <Image 
      source={source} 
      style={[
        styles.tabIcon,
        focused && styles.tabIconActive
      ]}
      resizeMode="contain"
    />
  );
}

export default function TabLayout() {
  // Always use light theme for tabs
  const colorScheme = 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          ...Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
          backgroundColor: '#ffffff', // Force white background
        },
        tabBarLabelStyle: {
          color: '#000000', // Force black text for labels
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon 
              source={focused ? homeIconActive : homeIconInactive}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon 
              source={focused ? profileIconActive : profileIconInactive}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon 
              source={focused ? cameraIconActive : cameraIconInactive}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon 
              source={focused ? historyIconActive : historyIconInactive}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon 
              source={focused ? settingsIconActive : settingsIconInactive}
              focused={focused}
            />
          ),
        }}
      />
      
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 24,
    height: 24,
  },
  tabIconActive: {
    // You can add light theme specific styling here
    tintColor: Colors.light.tint,
  }
});