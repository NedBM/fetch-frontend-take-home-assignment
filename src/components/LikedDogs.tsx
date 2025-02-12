import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFavorites } from '../../hooks/useFavorites';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Confetti from 'react-confetti';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, DogIcon, MapPin, ChevronLeft } from 'lucide-react';
import { AgeBadge } from './AgeBadge';
import { Dog, Location } from '../../types/api';

const LikedDogsPage = () => {
  const [dogToUnlike, setDogToUnlike] = useState<string | null>(null);
  const { favorites, setFavorites } = useFavorites();
  const [isGeneratingMatch, setIsGeneratingMatch] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Fetch dogs that are in favorites
  const { data: likedDogs = [], isLoading } = useQuery<Dog[]>({
    queryKey: ['likedDogs', Array.from(favorites)],
    queryFn: async () => {
      if (favorites.size === 0) return [];
      const response = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(Array.from(favorites))
      });
      if (!response.ok) throw new Error('Failed to fetch liked dogs');
      return response.json();
    },
    enabled: favorites.size > 0
  });

  // Fetch locations for the dogs
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['locations', likedDogs],
    queryFn: async () => {
      const zipCodes = [...new Set(likedDogs.map(dog => dog?.zip_code).filter(Boolean))];
      if (zipCodes.length === 0) return [];

      const response = await fetch('https://frontend-take-home-service.fetch.com/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(zipCodes)
      });
      if (!response.ok) throw new Error('Failed to fetch locations');
      return response.json();
    },
    enabled: likedDogs.length > 0
  });

  const handleUnlike = (dogId: string) => {
    setDogToUnlike(dogId);
  };

  const confirmUnlike = () => {
    if (dogToUnlike) {
      const newFavorites = new Set(favorites);
      newFavorites.delete(dogToUnlike);
      setFavorites(newFavorites);
      setDogToUnlike(null);
    }
  };

  const generateMatch = async () => {
    if (favorites.size === 0) return;
    
    setIsGeneratingMatch(true);
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
      const [fetchedMatchedDog] = await matchedDogResponse.json();
      setMatchedDog(fetchedMatchedDog);
      setShowConfetti(true);
      // Hide confetti after 5 seconds
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      console.error('Error generating match:', error);
    } finally {
      setIsGeneratingMatch(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading your liked dogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/search" passHref>
              <Button variant="outline">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Your Liked Dogs</h1>
          </div>
          {favorites.size > 0 && (
            <Button 
              onClick={generateMatch} 
              disabled={isGeneratingMatch}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
            >
              {isGeneratingMatch ? 'Generating Match...' : 'Generate Match'}
            </Button>
          )}
        </div>

        {favorites.size === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Heart className="w-16 h-16 text-gray-300" />
            <p className="text-gray-500 text-lg">You haven&apos;t liked any dogs yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {likedDogs.map(dog => (
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
                      <AgeBadge age={dog.age} />
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        {(() => {
                          const location = locations?.find(l => l?.zip_code === dog.zip_code);
                          return location ? (
                            <p className="text-sm text-gray-600">
                              {location.city}, {location.state}
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
                      variant="destructive"
                      size="icon"
                      onClick={() => handleUnlike(dog.id)}
                    >
                      <Heart className="fill-current" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Unlike Confirmation Modal */}
        <AlertDialog open={!!dogToUnlike} onOpenChange={() => setDogToUnlike(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unlike Dog</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this dog from your favorites?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmUnlike}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Match Result Modal */}
        <AlertDialog open={!!matchedDog} onOpenChange={() => setMatchedDog(null)}>
        <div className='z-[9999]'>
        {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={400}
        />
      )}
      </div>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Your Perfect Match!</AlertDialogTitle>
              <AlertDialogDescription>
                We found your perfect match: {matchedDog?.name}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-4">
                    <img 
                      src={matchedDog?.img} 
                      alt={matchedDog?.name}
                      className="h-52 rounded-md"
                    />
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">{matchedDog?.breed}</h3>
                      <p className="text-sm text-gray-500">{matchedDog?.age} years old</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setMatchedDog(null)}>
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default LikedDogsPage;