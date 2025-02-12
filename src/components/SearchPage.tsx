'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
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
import { Heart, ChevronLeft, ChevronRight, DogIcon, MapPin } from 'lucide-react';
import { BreedCombobox } from './BreedCombobox';
import { AgeBadge } from './AgeBadge';
import { Dog, Location } from '../../types/api';
import { AgeCombobox } from './AgeCombobox';
import { ZipCodeCombobox } from './ZipCombobox';
import { Badge } from './ui/badge';
import { useFavorites } from '../../hooks/useFavorites';

interface SearchResult {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

interface FetchDogIdsParams {
  page?: number;
  breeds?: string[];
  ages?: string[];
  zipCodes?: string[];
  sortOrder?: 'asc' | 'desc';
}

const DOGS_PER_PAGE = 12;

const fetchDogIds = async ({ page = 0, breeds = [], ages = [], zipCodes = [], sortOrder = 'asc' }: FetchDogIdsParams): Promise<SearchResult> => {
  const searchParams = new URLSearchParams();
  if (breeds.length) {
    breeds.forEach(breed => searchParams.append('breeds', breed));
  }
  if (zipCodes.length) {
    zipCodes.forEach(zip => searchParams.append('zipCodes', zip));
  }
  if (ages.length) {
    const minAge = Math.min(...ages.map(Number));
    const maxAge = Math.max(...ages.map(Number));
    searchParams.append('ageMin', minAge.toString());
    searchParams.append('ageMax', maxAge.toString());
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
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [selectedZipCodes, setSelectedZipCodes] = useState<string[]>([]);
  const [showOnlyNearby, setShowOnlyNearby] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();

  const { data: breeds = [] } = useQuery({
    queryKey: ['breeds'],
    queryFn: fetchBreeds,
  });

  const {
    data: searchResult,
    isLoading: isLoadingSearch,
    isFetching: isFetchingSearch,
    error: searchError,
  } = useQuery<SearchResult>({
    queryKey: ['dogIds', page, selectedBreeds, selectedAges, showOnlyNearby ? selectedZipCodes : [], sortOrder],
    queryFn: () => fetchDogIds({
      page,
      breeds: selectedBreeds,
      ages: selectedAges,
      zipCodes: showOnlyNearby ? selectedZipCodes : [],
      sortOrder: sortOrder
    }),
    placeholderData: (previousData) => previousData,
  });

  const {
    data: dogs = [],
    isLoading: isLoadingDogs,
  } = useQuery<Dog[]>({
    queryKey: ['dogs', searchResult?.resultIds],
    queryFn: () => fetchDogs(searchResult?.resultIds || []),
    enabled: !!searchResult?.resultIds?.length,
  });

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['locations', dogs],
    queryFn: async () => {
      try {
        const zipCodes = [...new Set(dogs
          .map(dog => dog?.zip_code)
          .filter(Boolean)
        )];
        
        if (zipCodes.length === 0) return [];
  
        const response = await fetch('https://frontend-take-home-service.fetch.com/locations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(zipCodes)
        });
  
        if (!response.ok) throw new Error('Failed to fetch locations');
        return response.json();
      } catch (error) {
        console.error('Error fetching locations:', error);
        return [];
      }
    },
    enabled: dogs.length > 0 && dogs.some(dog => Boolean(dog?.zip_code))
  });

  const calculateDistance = (zip1: string, zip2: string) => {
    const loc1 = locations.find(l => l.zip_code === zip1);
    const loc2 = locations.find(l => l.zip_code === zip2);
    
    if (!loc1 || !loc2) return Infinity;

    const R = 3958.8;
    const lat1 = loc1.latitude * Math.PI/180;
    const lat2 = loc2.latitude * Math.PI/180;
    const dLat = (loc2.latitude - loc1.latitude) * Math.PI/180;
    const dLon = (loc2.longitude - loc1.longitude) * Math.PI/180;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const isNearby = (dogZip: string) => {
    if (!selectedZipCodes.length) return false;
    return selectedZipCodes.some(zip => calculateDistance(zip, dogZip) <= 50);
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
        <div className="flex items-start gap-4">
          <BreedCombobox 
            breeds={breeds}
            selectedBreeds={selectedBreeds}
            onBreedsChange={setSelectedBreeds}
          />
          <ZipCodeCombobox 
            selectedZipCodes={selectedZipCodes}
            onZipCodesChange={setSelectedZipCodes}
            showOnlyNearby={showOnlyNearby}
            onShowOnlyNearbyChange={setShowOnlyNearby}
          />
          <AgeCombobox 
            selectedAges={selectedAges}
            onAgesChange={setSelectedAges}
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
            <Button 
              onClick={() => router.push('/liked-dogs')} 
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              View Liked Dogs ({favorites.size})
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
                <CardHeader className="pb-2">
                  <CardTitle>{dog.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <DogIcon className="w-4 h-4 text-gray-500" />
                    <CardDescription>{dog.breed}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <img 
                      src={dog.img} 
                      alt={dog.name}
                      className="h-52 rounded-md"
                    />
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <AgeBadge age={dog.age} />
                        {isNearby(dog.zip_code) && (
                          <Badge className="bg-green-500">Nearby</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        {(() => {
                          if (!dog?.zip_code) return <p className="text-sm text-gray-600">Location unavailable</p>;
                          
                          const location = locations?.find(l => l?.zip_code === dog.zip_code);
                          return location ? (
                            <p className="text-sm text-gray-600">
                              {location.city}, {location.state} ({dog.zip_code})
                            </p>
                          ) : (
                            <p className="text-sm text-gray-600">
                              ZIP Code: {dog.zip_code}
                            </p>
                          );
                        })()}
                      </div>
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
              
              if (page > 2) pageNumbers.push(0, '...');
              
              for (let i = Math.max(0, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                pageNumbers.push(i);
              }
              
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