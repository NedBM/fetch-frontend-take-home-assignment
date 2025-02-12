'use client';

import { useRouter } from 'next/navigation';
import LikedDogsPage from '@/components/LikedDogs';

export default function Page() {
  const router = useRouter();

  return (
    <LikedDogsPage 
      onBack={() => router.push('/')}
    />
  );
}