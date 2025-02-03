'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { BreedCombobox } from './BreedCombobox';
import { Dog } from '../../types/api';

interface SearchResult {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

interface FetchDogIdsParams {
    page?: number;
    breeds?: string[];
    sortOrder?: 'asc' | 'desc';
  }

const DOGS_PER_PAGE = 12;

const fetchDogIds = async ({ page = 0, breeds = [], sortOrder = 'asc' }: FetchDogIdsParams): Promise<SearchResult> => {
    const searchParams = new URLSearchParams();
    if (breeds.length) {
      breeds.forEach(breed => searchParams.append('breeds', breed));
    }
    searchParams.append('sort', `breed:${sortOrder}`);
    searchParams.append('size', DOGS_PER_PAGE.toString());
    if (page > 0) {
      searchParams.append('from', (page * DOGS_PER_PAGE).toString());
    }
  
    const response = await fetch(
      `https://frontend-take-home-service.fetch.com/dogs/search?${searchParams}`,
      { credentials: 'include' }
    );
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  };

const fetchDogs = async (dogIds: string[]): Promise<Dog[]> => {
  if (!dogIds.length) return [];
  const response = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(dogIds)
  });
  if (!response.ok) throw new Error('Failed to fetch dogs');
  return response.json();
};

const fetchBreeds = async (): Promise<string[]> => {
  const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch breeds');
  return response.json();
};

const ClientSearchPage = () => {
  const [page, setPage] = useState(0);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch breeds for the combobox
  const { data: breeds = [] } = useQuery({
    queryKey: ['breeds'],
    queryFn: fetchBreeds,
  });

  // Fetch dog IDs with pagination
  const {
    data: searchResult,
    isLoading: isLoadingSearch,
    isFetching: isFetchingSearch,
    error: searchError,
  } = useQuery<SearchResult>({
    queryKey: ['dogIds', page, selectedBreeds, sortOrder],
    queryFn: () => fetchDogIds({ 
      page, 
      breeds: selectedBreeds, 
      sortOrder: sortOrder 
    }),
    placeholderData: (previousData) => previousData,
  });

  // Fetch actual dog data once we have IDs
  const {
    data: dogs = [],
    isLoading: isLoadingDogs,
  } = useQuery<Dog[]>({
    queryKey: ['dogs', searchResult?.resultIds],
    queryFn: () => fetchDogs(searchResult?.resultIds || []),
    enabled: !!searchResult?.resultIds?.length,
  });

  const toggleFavorite = (dogId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(dogId)) {
        newFavorites.delete(dogId);
      } else {
        newFavorites.add(dogId);
      }
      return newFavorites;
    });
  };

  const generateMatch = async () => {
    if (favorites.size === 0) return;
    
    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(Array.from(favorites))
      });

      if (!response.ok) throw new Error('Match generation failed');
      const { match } = await response.json();
      
      const matchedDogResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify([match])
      });

      if (!matchedDogResponse.ok) throw new Error('Failed to fetch matched dog');
      const [matchedDog] = await matchedDogResponse.json();
      console.log('Matched dog:', matchedDog);
    } catch (error) {
      console.error('Error generating match:', error);
    }
  };

  const isLoading = isLoadingSearch || isLoadingDogs;
  const hasNextPage = searchResult?.resultIds?.length === DOGS_PER_PAGE;
  const hasPrevPage = page > 0;

  if (searchError) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-red-500">Error loading dogs. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <BreedCombobox 
            breeds={breeds}
            selectedBreeds={selectedBreeds}
            onBreedsChange={setSelectedBreeds}
          />

          <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>

          {favorites.size > 0 && (
            <Button onClick={generateMatch} variant="secondary">
              Generate Match ({favorites.size})
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array(DOGS_PER_PAGE).fill(0).map((_, i) => (
              <Card key={i} className="flex flex-col animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-48 bg-gray-200 rounded-md"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            dogs.map(dog => (
              <Card key={dog.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{dog.name}</CardTitle>
                  <CardDescription>{dog.breed}</CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src={dog.img} 
                    alt={dog.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="mt-4 flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm">Age: {dog.age} years</p>
                      <p className="text-sm">ZIP Code: {dog.zip_code}</p>
                    </div>
                    <Button
                      variant={favorites.has(dog.id) ? "destructive" : "secondary"}
                      size="icon"
                      onClick={() => toggleFavorite(dog.id)}
                    >
                      <Heart className={favorites.has(dog.id) ? "fill-current" : ""} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            onClick={() => setPage(old => Math.max(old - 1, 0))}
            disabled={!hasPrevPage || isLoading}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {(() => {
              const totalPages = Math.ceil((searchResult?.total || 0) / DOGS_PER_PAGE);
              const pageNumbers: (number | string)[] = [];
              
              // Always show first page
              if (page > 2) pageNumbers.push(0, '...');
              
              // Show current page and surrounding pages
              for (let i = Math.max(0, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                pageNumbers.push(i);
              }
              
              // Always show last page
              if (page < totalPages - 3) pageNumbers.push('...', totalPages - 1);
              
              return pageNumbers.map((pageNum, index) => {
                if (pageNum === '...') {
                  return <span key={`ellipsis-${index}`} className="px-2">...</span>;
                }
                return (
                  <Button
                    key={pageNum}
                    onClick={() => setPage(pageNum as number)}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    className="min-w-[2.5rem]"
                    disabled={isLoading}
                  >
                    {(pageNum as number) + 1}
                  </Button>
                );
              });
            })()}
          </div>

          <Button
            onClick={() => setPage(old => old + 1)}
            disabled={!hasNextPage || isLoading}
            variant="outline"
            size="sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {isFetchingSearch && !isLoading && (
            <span className="text-sm text-muted-foreground ml-2">(Loading...)</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientSearchPage;