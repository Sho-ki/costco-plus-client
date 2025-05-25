import React from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  ActivityIndicator,
  Surface,
  Divider,
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { apiService } from '../services/api';
import { useAppStore } from '../store/appStore';
import { formatRelativeTime, formatDate } from '../utils/dateUtils';

const FuelScreen: React.FC = () => {
  console.log('FuelScreen: Component rendering');
  
  const { selectedWarehouse } = useAppStore();

  // Fetch gas price data
  const {
    data: gasPriceData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['gasPrice', selectedWarehouse?.id],
    queryFn: () => apiService.fetchGasPrice(selectedWarehouse!.id),
    enabled: !!selectedWarehouse,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // Auto-refresh every 15 minutes
  });

  const renderFuelCard = (
    title: string,
    price: number | undefined,
    icon: string,
    color: string
  ) => (
    <Card style={styles.fuelCard}>
      <Card.Content style={styles.fuelContent}>
        <View style={styles.fuelHeader}>
          <MaterialCommunityIcons name={icon} size={32} color={color} />
          <Text variant="titleMedium" style={styles.fuelTitle}>
            {title}
          </Text>
        </View>
        
        {price ? (
          <Text variant="headlineLarge" style={[styles.fuelPrice, { color }]}>
            ¥{price.toFixed(1)}/L
          </Text>
        ) : (
          <Text variant="bodyMedium" style={styles.noPrice}>
            価格情報なし
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  if (error) {
    console.error('FuelScreen error:', error);
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons name="gas-station-off" size={48} color="#f44336" />
        <Text variant="headlineSmall" style={styles.errorTitle}>
          データの取得に失敗しました
        </Text>
        <Text variant="bodyMedium" style={styles.errorMessage}>
          ガソリン価格を取得できませんでした
        </Text>
        <Text variant="bodySmall" style={styles.errorDetails}>
          {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
        <Button mode="contained" onPress={() => refetch()} style={styles.retryButton}>
          再試行
        </Button>
      </View>
    );
  }

  if (!selectedWarehouse) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text variant="bodyLarge" style={styles.loadingText}>
          店舗情報を読み込み中...
        </Text>
      </View>
    );
  }

  if (isLoading && !isRefetching) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text variant="bodyLarge" style={styles.loadingText}>
          ガソリン価格を確認中...
        </Text>
      </View>
    );
  }

  const gasPrice = gasPriceData?.data;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      {/* Store Info */}
      <Surface style={styles.storeCard}>
        <Text variant="headlineSmall" style={styles.storeTitle}>
          {selectedWarehouse?.name || '店舗未選択'}
        </Text>
        <Text variant="bodyMedium" style={styles.storeSubtitle}>
          ガソリンスタンド価格情報
        </Text>
      </Surface>

      {/* Fuel Prices */}
      <View style={styles.fuelGrid}>
        {renderFuelCard(
          'レギュラー',
          gasPrice?.regularPrice,
          'gas-station',
          '#4caf50'
        )}
        
        {renderFuelCard(
          'ハイオク',
          gasPrice?.premiumPrice,
          'gas-station',
          '#ff9800'
        )}
        
        {renderFuelCard(
          'ディーゼル',
          gasPrice?.dieselPrice,
          'gas-station',
          '#2196f3'
        )}
      </View>

      {/* Last Updated Info */}
      {gasPrice?.lastUpdated && (
        <Card style={styles.updateCard}>
          <Card.Content>
            <View style={styles.updateHeader}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
              <Text variant="titleSmall" style={styles.updateTitle}>
                価格更新情報
              </Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.updateInfo}>
              <Text variant="bodyMedium" style={styles.updateText}>
                最終更新: {formatRelativeTime(gasPrice.lastUpdated)}
              </Text>
              <Text variant="bodySmall" style={styles.updateDate}>
                {formatDate(gasPrice.lastUpdated, 'yyyy年MM月dd日 HH:mm')}
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Info Card */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.infoHeader}>
            <MaterialCommunityIcons name="information-outline" size={24} color="#2196f3" />
            <Text variant="titleMedium" style={styles.infoTitle}>
              ご利用について
            </Text>
          </View>
          
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="card-account-details" size={16} color="#666" />
              <Text variant="bodyMedium" style={styles.infoText}>
                コストコ会員証が必要です
              </Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="credit-card" size={16} color="#666" />
              <Text variant="bodyMedium" style={styles.infoText}>
                現金・クレジットカード利用可能
              </Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="clock-time-four" size={16} color="#666" />
              <Text variant="bodyMedium" style={styles.infoText}>
                営業時間は店舗により異なります
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Refresh Info */}
      <Card style={styles.refreshCard}>
        <Card.Content>
          <View style={styles.refreshInfo}>
            <MaterialCommunityIcons name="refresh" size={20} color="#666" />
            <Text variant="bodySmall" style={styles.refreshText}>
              価格情報は15分ごとに自動更新されます
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#666',
  },
  errorDetails: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#666',
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
  },
  storeCard: {
    margin: 16,
    padding: 20,
    elevation: 2,
    borderRadius: 12,
  },
  storeTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  storeSubtitle: {
    color: '#666',
  },
  fuelGrid: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  fuelCard: {
    elevation: 2,
  },
  fuelContent: {
    padding: 20,
  },
  fuelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fuelTitle: {
    marginLeft: 12,
    fontWeight: 'bold',
  },
  fuelPrice: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noPrice: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  updateCard: {
    margin: 16,
    marginTop: 0,
  },
  updateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  updateTitle: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  divider: {
    marginBottom: 12,
  },
  updateInfo: {
    alignItems: 'center',
  },
  updateText: {
    marginBottom: 4,
  },
  updateDate: {
    color: '#666',
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    flex: 1,
    color: '#666',
  },
  refreshCard: {
    margin: 16,
    marginTop: 0,
    marginBottom: 32,
  },
  refreshInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshText: {
    marginLeft: 8,
    color: '#666',
  },
});

export default FuelScreen; 
