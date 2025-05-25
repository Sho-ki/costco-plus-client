import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  ActivityIndicator,
  Chip,
  Surface,
  FAB,
  TextInput,
  Portal,
  Dialog,
  RadioButton,
} from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { apiService } from '../services/api';
import { useAppStore } from '../store/appStore';
import { PostWithCount } from '../types/post';
import { formatRelativeTime } from '../utils/dateUtils';
import { checkNetworkStatus } from '../utils/offlineUtils';

const PostScreen: React.FC = () => {
  console.log('PostScreen: Component rendering');
  
  const { selectedWarehouse, addToOfflineQueue } = useAppStore();
  const queryClient = useQueryClient();
  
  const sortField = 'createdAt'; // Fixed for now
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPostType, setSelectedPostType] = useState<number | null>(null);
  const page = 1;

  // Fetch post types
  const { data: postTypesData } = useQuery({
    queryKey: ['postTypes'],
    queryFn: () => apiService.fetchPostTypes(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Fetch reaction types
  const { data: reactionTypesData } = useQuery({
    queryKey: ['reactionTypes'],
    queryFn: () => apiService.fetchPostReactionTypes(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Fetch posts
  const {
    data: postsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['posts', selectedWarehouse?.id, sortField, sortOrder, typeFilter, page],
    queryFn: () =>
      apiService.fetchPosts(selectedWarehouse!.id, {
        page,
        size: 20,
        sortField,
        order: sortOrder,
        typeFilter,
      }),
    enabled: !!selectedWarehouse,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: ({ content, postTypeId }: { content: string; postTypeId: number }) =>
      apiService.createPost(selectedWarehouse!.id, content, postTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setShowCreateModal(false);
      setNewPostContent('');
      setSelectedPostType(null);
    },
    onError: async () => {
      // Add to offline queue if network is unavailable
      const isOnline = await checkNetworkStatus();
      if (!isOnline && selectedPostType) {
        addToOfflineQueue({
          type: 'post',
          data: {
            warehouseId: selectedWarehouse!.id,
            content: newPostContent,
            postTypeId: selectedPostType,
          },
        });
        Alert.alert('オフライン', '投稿をキューに追加しました。オンラインになったら自動的に投稿されます。');
        setShowCreateModal(false);
        setNewPostContent('');
        setSelectedPostType(null);
      } else {
        Alert.alert('エラー', '投稿の作成に失敗しました。');
      }
    },
  });

  // Reaction mutation
  const reactionMutation = useMutation({
    mutationFn: ({ postId, reactionTypeId }: { postId: number; reactionTypeId: number }) =>
      apiService.postReactionRecord(postId, reactionTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: async (error, variables) => {
      const isOnline = await checkNetworkStatus();
      if (!isOnline) {
        addToOfflineQueue({
          type: 'reaction',
          data: {
            postId: variables.postId,
            postReactionTypeId: variables.reactionTypeId,
          },
        });
        Alert.alert('オフライン', 'リアクションをキューに追加しました。');
      } else {
        Alert.alert('エラー', 'リアクションの送信に失敗しました。');
      }
    },
  });

  const handleCreatePost = () => {
    if (!newPostContent.trim() || !selectedPostType) {
      Alert.alert('エラー', '投稿内容と種類を選択してください。');
      return;
    }

    createPostMutation.mutate({
      content: newPostContent.trim(),
      postTypeId: selectedPostType,
    });
  };

  const handleReaction = (postId: number, reactionTypeId: number) => {
    reactionMutation.mutate({ postId, reactionTypeId });
  };

  const renderPost = ({ item }: { item: PostWithCount }) => (
    <Card style={styles.postCard}>
      <Card.Content>
        <View style={styles.postHeader}>
          <Chip mode="outlined" style={styles.postTypeChip}>
            {item.postType.name}
          </Chip>
          <Text variant="bodySmall" style={styles.timestamp}>
            {formatRelativeTime(item.createdAt)}
          </Text>
        </View>

        <Text variant="bodyLarge" style={styles.postContent}>
          {item.content}
        </Text>

        <View style={styles.postFooter}>
          <View style={styles.reactionContainer}>
            {reactionTypesData?.data?.slice(0, 3).map((reactionType) => (
              <Button
                key={reactionType.id}
                mode="outlined"
                compact
                onPress={() => handleReaction(item.id, reactionType.id)}
                style={styles.reactionButton}
              >
                {reactionType.emoji} {reactionType.name}
              </Button>
            ))}
          </View>
          
          <View style={styles.statsContainer}>
            <Text variant="bodySmall" style={styles.stats}>
              <MaterialCommunityIcons name="heart" size={14} /> {item.reactionCount}
            </Text>
            <Text variant="bodySmall" style={styles.stats}>
              <MaterialCommunityIcons name="comment" size={14} /> {item.commentCount}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (error) {
    console.error('PostScreen error:', error);
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
        <View style={styles.sortContainer}>
          <Button
            mode={sortOrder === 'desc' ? 'contained' : 'outlined'}
            onPress={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            style={styles.sortButton}
          >
            {sortOrder === 'desc' ? '新しい順' : '古い順'}
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => {
              // Toggle between different type filters
              const filters = ['all', 'question', 'info', 'sale'];
              const currentIndex = filters.indexOf(typeFilter);
              const nextIndex = (currentIndex + 1) % filters.length;
              setTypeFilter(filters[nextIndex]);
            }}
            style={styles.sortButton}
          >
            {typeFilter === 'all' ? '全て' : typeFilter}
          </Button>
        </View>
      </Surface>

      {/* Post List */}
      {isLoading && !isRefetching ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <Text variant="bodyLarge" style={styles.loadingText}>
            投稿を読み込み中...
          </Text>
        </View>
      ) : (
        <FlatList
          data={postsData?.data || []}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Create Post FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
        label="投稿"
      />

      {/* Create Post Modal */}
      <Portal>
        <Dialog visible={showCreateModal} onDismiss={() => setShowCreateModal(false)}>
          <Dialog.Title>新しい投稿</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.modalLabel}>
              投稿の種類を選択:
            </Text>
            <RadioButton.Group
              onValueChange={(value) => setSelectedPostType(parseInt(value))}
              value={selectedPostType?.toString() || ''}
            >
              {postTypesData?.data?.map((postType) => (
                <RadioButton.Item
                  key={postType.id}
                  label={postType.name}
                  value={postType.id.toString()}
                />
              ))}
            </RadioButton.Group>

            <TextInput
              label="投稿内容"
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              numberOfLines={4}
              style={styles.textInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCreateModal(false)}>キャンセル</Button>
            <Button
              mode="contained"
              onPress={handleCreatePost}
              loading={createPostMutation.isPending}
              disabled={!newPostContent.trim() || !selectedPostType}
            >
              投稿
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    paddingBottom: 80, // Space for FAB
  },
  postCard: {
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postTypeChip: {
    backgroundColor: '#e3f2fd',
  },
  timestamp: {
    color: '#666',
  },
  postContent: {
    marginBottom: 16,
    lineHeight: 24,
  },
  postFooter: {
    gap: 12,
  },
  reactionContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  reactionButton: {
    minWidth: 80,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  stats: {
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#0073e6',
  },
  modalLabel: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  textInput: {
    marginTop: 16,
  },
  errorText: {
    marginTop: 8,
    color: 'red',
  },
});

export default PostScreen; 
