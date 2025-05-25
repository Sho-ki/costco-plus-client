import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Warehouse } from '../types/warehouse';

// ウェブ環境用のストレージ
const getStorage = () => {
	if (Platform.OS === 'web') {
		return {
			getItem: (name: string) => {
				const value = localStorage.getItem(name);
				return Promise.resolve(value);
			},
			setItem: (name: string, value: string) => {
				localStorage.setItem(name, value);
				return Promise.resolve();
			},
			removeItem: (name: string) => {
				localStorage.removeItem(name);
				return Promise.resolve();
			},
		};
	}
	return AsyncStorage;
};

interface OfflineQueueItem {
	id: string;
	type: 'post' | 'comment' | 'reaction';
	data: Record<string, unknown>;
	timestamp: number;
}

interface AppState {
	// Warehouse selection
	selectedWarehouse: Warehouse | null;
	warehouses: Warehouse[];

	// Offline queue
	offlineQueue: OfflineQueueItem[];

	// UI state
	isLoading: boolean;
	error: string | null;

	// Actions
	setSelectedWarehouse: (warehouse: Warehouse) => void;
	setWarehouses: (warehouses: Warehouse[]) => void;
	addToOfflineQueue: (item: { type: 'post' | 'comment' | 'reaction'; data: Record<string, unknown> }) => void;
	removeFromOfflineQueue: (id: string) => void;
	clearOfflineQueue: () => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>()(
	persist(
		(set) => ({
			// Initial state
			selectedWarehouse: null,
			warehouses: [],
			offlineQueue: [],
			isLoading: false,
			error: null,

			// Actions
			setSelectedWarehouse: (warehouse) => set({ selectedWarehouse: warehouse }),

			setWarehouses: (warehouses) => set({ warehouses }),

			addToOfflineQueue: (item) => {
				const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
				const queueItem: OfflineQueueItem = {
					id,
					...item,
					timestamp: Date.now(),
				};
				set((state) => ({
					offlineQueue: [...state.offlineQueue, queueItem],
				}));
			},

			removeFromOfflineQueue: (id) => {
				set((state) => ({
					offlineQueue: state.offlineQueue.filter((item) => item.id !== id),
				}));
			},

			clearOfflineQueue: () => set({ offlineQueue: [] }),

			setLoading: (loading) => set({ isLoading: loading }),

			setError: (error) => set({ error }),
		}),
		{
			name: 'costco-plus-storage',
			storage: createJSONStorage(() => getStorage()),
			partialize: (state) => ({
				selectedWarehouse: state.selectedWarehouse,
				offlineQueue: state.offlineQueue,
			}),
		}
	)
);
