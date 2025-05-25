import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  ActivityIndicator,
  Chip,
  Surface,
  Divider,
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';

import { apiService } from '../services/api';
import { useAppStore } from '../store/appStore';
import { ProductForUsers } from '../types/product';
import { formatDate } from '../utils/dateUtils';

const SaleScreen: React.FC = () => {
  const { selectedWarehouse, warehouses, setSelectedWarehouse, setWarehouses } = useAppStore();
  const [sortField, setSortField] = useState<'price' | 'discountPercentage'>('discountPercentage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const page = 1; // Fixed page for now, can be extended for pagination later

  // Fetch warehouses on mount
  const { data: warehousesData } = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => apiService.fetchWarehouses(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Fetch weekly buys
  const {
    data: productsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['weeklyBuys', selectedWarehouse?.id, sortField, sortOrder, page],
    queryFn: () =>
      apiService.fetchWeeklyBuys(selectedWarehouse!.id, {
        page,
        size: 20,
        sortField,
        sortOrder,
      }),
    enabled: !!selectedWarehouse,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (warehousesData?.data && warehouses.length === 0) {
      console.log('Setting warehouses:', warehousesData.data);
      setWarehouses(warehousesData.data);
      if (!selectedWarehouse && warehousesData.data.length > 0) {
        console.log('Setting selected warehouse:', warehousesData.data[0]);
        setSelectedWarehouse(warehousesData.data[0]);
      }
    }
  }, [warehousesData, warehouses.length, selectedWarehouse, setWarehouses, setSelectedWarehouse]);

  // Add debug logging for products data
  useEffect(() => {
    console.log('Products data:', productsData);
    console.log('Is loading:', isLoading);
    console.log('Error:', error);
    console.log('Selected warehouse:', selectedWarehouse);
  }, [productsData, isLoading, error, selectedWarehouse]);

  const handleWarehouseSelect = () => {
    console.log('Warehouse button pressed');
    console.log('Warehouses available:', warehouses);
    console.log('Warehouses length:', warehouses.length);
    
    if (warehouses.length === 0) {
      Alert.alert(
        'エラー',
        '利用可能な店舗がありません。しばらく待ってから再試行してください。',
        [{ text: 'OK' }]
      );
      return;
    }

    setShowWarehouseModal(true);
  };

  const handleWarehouseSelection = (warehouse: { id: number; name: string }) => {
    console.log('Selected warehouse:', warehouse);
    setSelectedWarehouse(warehouse);
    setShowWarehouseModal(false);
  };

  const toggleSort = () => {
    if (sortField === 'discountPercentage') {
      setSortField('price');
    } else {
      setSortField('discountPercentage');
    }
  };

  const toggleOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const renderProduct = ({ item }: { item: ProductForUsers }) => {
    console.log('Rendering product:', item);
    
    // Calculate discount percentage
    const discountPercentage = item.discount
      ? Math.round((item.discount / item.price) * 100)
      : 0;

    // Calculate final price
    const finalPrice = item.price - (item.discount || 0);

    return (
      <Card style={styles.productCard}>
        <Card.Content>
          {/* Product Image */}
          {item.altImageUrl ? (
            <View style={styles.imageContainer}>
              <Image
                alt={item.name}
                source={{ uri: item.altImageUrl }}
                style={styles.productImage}
                resizeMode="cover"
                onError={(error) => console.log('Image load error:', error)}
              />
            </View>
          ) : (
            <View style={styles.placeholderImage}>
              <Text variant="bodySmall" style={styles.placeholderText}>
                画像がありません
              </Text>
            </View>
          )}

          <View style={styles.productHeader}>
            <Text variant="titleMedium" style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>
            {item.discount && discountPercentage > 0 && (
              <Chip mode="flat" style={styles.discountChip}>
                {discountPercentage}%OFF
              </Chip>
            )}
          </View>
          
          <View style={styles.priceContainer}>
            <Text variant="headlineSmall" style={styles.currentPrice}>
              ¥{finalPrice.toLocaleString()}
            </Text>
            {item.discount && item.discount > 0 && (
              <Text variant="bodyMedium" style={styles.originalPrice}>
                ¥{item.price.toLocaleString()}
              </Text>
            )}
          </View>

          {item.description && (
            <Text variant="bodyMedium" style={styles.description} numberOfLines={3}>
              {item.description}
            </Text>
          )}

          {/* Sale period */}
          {(item.saleStartDate || item.saleEndDate) && (
            <Text variant="bodySmall" style={styles.saleInfo}>
              セール期間: {item.saleStartDate && item.saleEndDate ? 
                `${formatDate(item.saleStartDate)} ~ ${formatDate(item.saleEndDate)}` :
                item.saleEndDate ? `~ ${formatDate(item.saleEndDate)}` : 
                item.saleStartDate ? `${formatDate(item.saleStartDate)} ~` : ''
              }
            </Text>
          )}

          {item.lastUpdated && (
            <Text variant="bodySmall" style={styles.lastUpdated}>
              更新日: {formatDate(item.lastUpdated)}
            </Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  if (error) {
    console.error('SaleScreen error:', error);
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
      {/* Header Controls */}
      <Surface style={styles.header}>
        <View style={styles.headerRow}>
          <Button
            mode="outlined"
            onPress={handleWarehouseSelect}
            style={styles.warehouseButton}
          >
            {selectedWarehouse?.name || '店舗を選択'}
          </Button>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.sortContainer}>
          <Button
            mode={sortField === 'discountPercentage' ? 'contained' : 'outlined'}
            onPress={toggleSort}
            style={styles.sortButton}
          >
            {sortField === 'discountPercentage' ? '割引率順' : '価格順'}
          </Button>
          <Button
            mode="outlined"
            onPress={toggleOrder}
            style={styles.sortButton}
          >
            {sortOrder === 'desc' ? '降順' : '昇順'}
          </Button>
        </View>
      </Surface>

      {/* Warehouse Selection Modal */}
      <Modal
        visible={showWarehouseModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWarehouseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              店舗を選択
            </Text>
            <FlatList
              data={warehouses}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.warehouseItem,
                    selectedWarehouse?.id === item.id && styles.selectedWarehouseItem
                  ]}
                  onPress={() => handleWarehouseSelection(item)}
                >
                  <Text variant="bodyLarge" style={styles.warehouseItemText}>
                    {item.name}
                  </Text>
                  {selectedWarehouse?.id === item.id && (
                    <Text variant="bodySmall" style={styles.selectedText}>
                      選択中
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            />
            <Button
              mode="outlined"
              onPress={() => setShowWarehouseModal(false)}
              style={styles.cancelButton}
            >
              キャンセル
            </Button>
          </View>
        </View>
      </Modal>

      {/* Product List */}
      {isLoading && !isRefetching ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <Text variant="bodyLarge" style={styles.loadingText}>
            商品情報を読み込み中...
          </Text>
        </View>
      ) : (
        <FlatList
          data={productsData?.data || []}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text variant="bodyLarge">商品データがありません</Text>
              <Text variant="bodyMedium" style={styles.emptyText}>
                選択した店舗にセール商品がないか、データの読み込みに失敗しました。
              </Text>
              <Text variant="bodySmall" style={styles.debugText}>
                データ件数: {productsData?.data?.length || 0}
              </Text>
              <Text variant="bodySmall" style={styles.debugText}>
                店舗ID: {selectedWarehouse?.id}
              </Text>
            </View>
          }
        />
      )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  warehouseButton: {
    flex: 1,
  },
  divider: {
    marginVertical: 12,
  },
  sortContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flex: 1,
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
  listContainer: {
    padding: 16,
  },
  productCard: {
    marginBottom: 12,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    flex: 1,
    marginRight: 8,
  },
  discountChip: {
    backgroundColor: '#e31837',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 8,
  },
  currentPrice: {
    color: '#e31837',
    fontWeight: 'bold',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  description: {
    marginBottom: 8,
    color: '#666',
  },
  lastUpdated: {
    color: '#999',
  },
  imageContainer: {
    height: 150,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    height: 150,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
  },
  placeholderText: {
    color: '#999',
  },
  saleInfo: {
    color: '#666',
    marginBottom: 4,
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
  debugText: {
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  warehouseItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedWarehouseItem: {
    backgroundColor: '#e3f2fd',
  },
  warehouseItemText: {
    flex: 1,
  },
  selectedText: {
    color: '#1976d2',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 16,
  },
});

export default SaleScreen; 
