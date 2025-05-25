import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';

// Screens
import SaleScreen from '../screens/SaleScreen';
import PostScreen from '../screens/PostScreen';
import CrowdednessScreen from '../screens/CrowdednessScreen';
import FuelScreen from '../screens/FuelScreen';

// Debug logging
console.log('TabNavigator: Screens imported successfully');
console.log('SaleScreen:', SaleScreen);
console.log('PostScreen:', PostScreen);
console.log('CrowdednessScreen:', CrowdednessScreen);
console.log('FuelScreen:', FuelScreen);

export type TabParamList = {
  Sale: undefined;
  Post: undefined;
  Crowdedness: undefined;
  Fuel: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  const theme = useTheme();
  console.log('TabNavigator: Rendering with theme:', theme);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Sale':
              iconName = focused ? 'tag' : 'tag-outline';
              break;
            case 'Post':
              iconName = focused ? 'forum' : 'forum-outline';
              break;
            case 'Crowdedness':
              iconName = focused ? 'account-group' : 'account-group-outline';
              break;
            case 'Fuel':
              iconName = focused ? 'gas-station' : 'gas-station-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerShown: true,
      })}
    >
      <Tab.Screen 
        name="Sale" 
        component={SaleScreen} 
        options={{ title: 'セール情報' }}
      />
      <Tab.Screen 
        name="Post" 
        component={PostScreen} 
        options={{ title: '投稿' }}
      />
      <Tab.Screen 
        name="Crowdedness" 
        component={CrowdednessScreen} 
        options={{ title: '混雑状況' }}
      />
      <Tab.Screen 
        name="Fuel" 
        component={FuelScreen} 
        options={{ title: 'ガソリン価格' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
