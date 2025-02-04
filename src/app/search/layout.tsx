import { Suspense } from 'react';
import { Card } from "@/components/ui/card";
import { Dog } from 'lucide-react';

function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(12).fill(0).map((_, i) => (
          <Card key={i} className="flex flex-col animate-pulse">
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="p-6">
              <div className="w-full h-48 bg-gray-200 rounded-md"></div>
              <div className="mt-4 flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <Dog className="w-8 h-8 text-gray-900" />
            <h1 className="text-3xl font-bold text-gray-900">Fetch Finder</h1>
          </div>
        </div>
      </header>
      <main>
        <Suspense fallback={<LoadingSkeleton />}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}