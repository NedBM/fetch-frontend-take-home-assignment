import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const FAVORITES_KEY = 'dog-favorites';

const getFavoritesFromStorage = (): Set<string> => {
  if (typeof window === 'undefined') return new Set();
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? new Set(JSON.parse(stored)) : new Set();
};

const saveFavoritesToStorage = async (newFavorites: Set<string>): Promise<Set<string>> => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavorites)));
  return newFavorites;
};

export const useFavorites = () => {
  const queryClient = useQueryClient();

  const { data: favorites = new Set() } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavoritesFromStorage,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: saveFavoritesToStorage,
    onSuccess: (newFavorites) => {
      queryClient.setQueryData(['favorites'], newFavorites);
    },
  });

  const toggleFavorite = (dogId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(dogId)) {
      newFavorites.delete(dogId);
    } else {
      newFavorites.add(dogId);
    }
    mutation.mutate(newFavorites);
  };

  return {
    favorites,
    toggleFavorite,
    setFavorites: (newFavorites: Set<string>) => mutation.mutate(newFavorites),
  };
};