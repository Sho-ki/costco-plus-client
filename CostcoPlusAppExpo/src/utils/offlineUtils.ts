import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {useAppStore} from '../store/appStore';
import {apiService} from '../services/api';

export const checkNetworkStatus = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
};

export const processOfflineQueue = async () => {
  const isConnected = await checkNetworkStatus();
  if (!isConnected) return;

  const {offlineQueue, removeFromOfflineQueue} = useAppStore.getState();

  for (const item of offlineQueue) {
    try {
      switch (item.type) {
        case 'post':
          await apiService.createPost(
            item.data.warehouseId as number,
            item.data.content as string,
            item.data.postTypeId as number,
          );
          break;
        case 'comment':
          await apiService.createComment(
            item.data.postId as number,
            item.data.comment as string,
          );
          break;
        case 'reaction':
          await apiService.postReactionRecord(
            item.data.postId as number,
            item.data.postReactionTypeId as number,
          );
          break;
      }
      removeFromOfflineQueue(item.id);
    } catch (error) {
      console.error('Failed to process offline queue item:', error);
      // Keep the item in queue for retry
    }
  }
};

export const setupNetworkListener = () => {
  return NetInfo.addEventListener((state: NetInfoState) => {
    if (state.isConnected) {
      processOfflineQueue();
    }
  });
};
