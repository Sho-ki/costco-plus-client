import React from 'react';
import { Platform } from 'react-native';

// Web用のアイコンコンポーネント
const WebIcon: React.FC<{ name: string; size: number; color: string; style?: Record<string, unknown> }> = ({ 
  name, 
  size, 
  color, 
  style 
}) => {
  if (Platform.OS !== 'web') {
    return null;
  }

  // Material Design Iconsのマッピング
  const iconMap: { [key: string]: string } = {
    'account-outline': 'mdi-account-outline',
    'account-group-outline': 'mdi-account-group-outline',
    'account-multiple': 'mdi-account-multiple',
    'help-circle-outline': 'mdi-help-circle-outline',
    'alert-circle': 'mdi-alert-circle',
    'clock-outline': 'mdi-clock-outline',
    'calendar-weekend': 'mdi-calendar-weekend',
    'cart-outline': 'mdi-cart-outline',
    'refresh': 'mdi-refresh',
    'lightbulb-outline': 'mdi-lightbulb-outline',
    'home': 'mdi-home',
    'store': 'mdi-store',
    'account-group': 'mdi-account-group',
    'map-marker': 'mdi-map-marker',
    'star': 'mdi-star',
    'heart': 'mdi-heart',
    'shopping': 'mdi-shopping',
    'menu': 'mdi-menu',
    'close': 'mdi-close',
    'search': 'mdi-magnify',
    'filter': 'mdi-filter',
    'sort': 'mdi-sort',
    'chevron-right': 'mdi-chevron-right',
    'chevron-left': 'mdi-chevron-left',
    'plus': 'mdi-plus',
    'minus': 'mdi-minus',
  };

  const iconClass = iconMap[name] || `mdi-${name}`;

  return (
    <i 
      className={`mdi ${iconClass}`}
      style={{
        fontSize: size,
        color: color,
        lineHeight: 1,
        ...style
      }}
    />
  );
};

export default WebIcon; 
