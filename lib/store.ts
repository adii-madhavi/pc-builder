import { create } from 'zustand';
import { apiClient } from './api-client';

interface User {
  _id: string;
  email: string;
  username: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
  };
}

export interface BuildComponent {
  _id: string;
  type: string;
  brand: string;
  model: string;
  price: number;
  specs?: any;
  performanceScore?: number;
  tdp?: number;
  power?: number;
}

export interface Build {
  _id: string;
  name: string;
  description?: string;
  components: {
    cpu?: BuildComponent;
    gpu?: BuildComponent;
    motherboard?: BuildComponent;
    ram?: BuildComponent[];
    psu?: BuildComponent;
    storage?: BuildComponent[];
    cooler?: BuildComponent;
    case?: BuildComponent;
  };
  totalCost: number;
  performance?: any;
  thermal?: any;
  power?: any;
  compatibility?: any;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

interface BuildStore {
  currentBuild: Build | null;
  builds: Build[];
  selectedComponents: Partial<Build['components']>;
  setCurrentBuild: (build: Build | null) => void;
  setBuilds: (builds: Build[]) => void;
  setSelectedComponent: (type: keyof Build['components'], component: BuildComponent | BuildComponent[] | null) => void;
  clearSelectedComponents: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  setUser: (user) => {
    set({ user });
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  },
  setToken: (token) => {
    set({ token });
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  },
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => {
    set({ user: null, token: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  },
}));

// Restore before protected pages decide whether to redirect.
let authInitialization: Promise<void> | undefined;
export function initializeAuthStore() {
  if (typeof window === 'undefined') return;
  if (authInitialization) return authInitialization;
  authInitialization = (async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await apiClient.getCurrentUser();
      useAuthStore.getState().setUser(response.data);
      useAuthStore.setState({ token });
    } catch {
      useAuthStore.getState().logout();
    } finally {
      useAuthStore.setState({ isLoading: false });
    }
  })();
  return authInitialization;
}

export const useBuildStore = create<BuildStore>((set) => ({
  currentBuild: null,
  builds: [],
  selectedComponents: {},
  setCurrentBuild: (build) => set({ currentBuild: build }),
  setBuilds: (builds) => set({ builds }),
  setSelectedComponent: (type, component) => set((state) => {
    const selectedComponents = { ...state.selectedComponents };
    if (!component || (Array.isArray(component) && !component.length)) {
      delete selectedComponents[type];
    } else {
      Object.assign(selectedComponents, {
        [type]: type === 'ram' || type === 'storage'
          ? (Array.isArray(component) ? component : [component]) : component,
      });
    }
    return { selectedComponents };
  }),
  clearSelectedComponents: () => set({ selectedComponents: {} }),
}));
