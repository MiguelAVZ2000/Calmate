'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-lg">
      <CardContent className="p-0 flex-grow">
        <Skeleton className="w-full h-64" />
        <div className="p-4 flex flex-col flex-grow">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-3" />
          <div className="flex items-baseline justify-start mt-auto">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-6 w-1/4 ml-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}