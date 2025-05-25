import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  ActivityIndicator,
  Surface,
  ProgressBar,
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';

import { apiService } from '../services/api';
import { useAppStore } from '../store/appStore';

const CrowdednessScreen: React.FC = () => {
  console.log('CrowdednessScreen: Component rendering');
  
  const { selectedWarehouse, warehouses, setSelectedWarehouse, setWarehouses } = useAppStore();

  // Fetch warehouses on mount
  const { data: warehousesData } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => apiService.fetchWarehouses(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Fetch crowd data
  const {
    data: crowdData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['crowdData', selectedWarehouse?.id],
    queryFn: () => apiService.fetchCrowdData(selectedWarehouse!.id),
    enabled: !!selectedWarehouse,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  useEffect(() => {
    if (warehousesData?.data && warehouses.length === 0) {
      setWarehouses(warehousesData.data);
      if (!selectedWarehouse && warehousesData.data.length > 0) {
        setSelectedWarehouse(warehousesData.data[0]);
      }
    }
  }, [warehousesData, warehouses.length, selectedWarehouse, setWarehouses, setSelectedWarehouse]);

  const handleWarehouseSelect = () => {
    if (warehouses.length === 0) return;

    Alert.alert(
      '店舗を選択',
      '表示する店舗を選択してください',
      warehouses.map((warehouse) => ({
        text: warehouse.name,
        onPress: () => setSelectedWarehouse(warehouse),
      }))
    );
  };

  const getCrowdLevelText = (level: number) => {
    if (level <= 0.3) return '空いています';
    if (level <= 0.6) return '普通';
    if (level <= 0.8) return '混雑';
    return '非常に混雑';
  };

  const getCrowdLevelColor = (level: number) => {
    if (level <= 0.3) return '#4CAF50';
    if (level <= 0.6) return '#FF9800';
    if (level <= 0.8) return '#FF5722';
    return '#F44336';
  };

  if (error) {
    console.error('CrowdednessScreen error:', error);
    return (
      <View style={styles.centerContainer}>
        <Text variant="bodyLarge">データの取得に失敗しました</Text>
        <Text variant="bodyMedium" style={styles.errorText}>
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={styles.header}>
        <Button
          mode="outlined"
          onPress={handleWarehouseSelect}
          style={styles.warehouseButton}
        >
          {selectedWarehouse?.name || '店舗を選択'}
        </Button>
      </Surface>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {isLoading && !isRefetching ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" />
            <Text variant="bodyLarge" style={styles.loadingText}>
              混雑状況を読み込み中...
            </Text>
          </View>
        ) : crowdData?.data ? (
          <Card style={styles.crowdCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.cardTitle}>
                現在の混雑状況
              </Text>
              
              <View style={styles.crowdInfo}>
                <Text 
                  variant="displaySmall" 
                  style={[
                    styles.crowdLevel,
                    { color: getCrowdLevelColor(crowdData.data.level) }
                  ]}
                >
                  {getCrowdLevelText(crowdData.data.level)}
                </Text>
                
                <ProgressBar
                  progress={crowdData.data.level}
                  color={getCrowdLevelColor(crowdData.data.level)}
                  style={styles.progressBar}
                />
                
                <Text variant="bodyMedium" style={styles.levelPercentage}>
                  混雑度: {Math.round(crowdData.data.level * 100)}%
                </Text>
              </View>

              {crowdData.data.lastUpdated && (
                <Text variant="bodySmall" style={styles.lastUpdated}>
                  最終更新: {new Date(crowdData.data.lastUpdated).toLocaleString('ja-JP')}
                </Text>
              )}
            </Card.Content>
          </Card>
        ) : (
          <View style={styles.centerContainer}>
            <Text variant="bodyLarge">混雑データがありません</Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              選択した店舗の混雑データが取得できませんでした。
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    padding: 16,
    elevation: 2,
  },
  warehouseButton: {
    width: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
  },
  retryButton: {
    marginTop: 16,
  },
  crowdCard: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  crowdInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  crowdLevel: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    marginBottom: 8,
  },
  levelPercentage: {
    color: '#666',
  },
  lastUpdated: {
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    color: '#e31837',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default CrowdednessScreen; 
