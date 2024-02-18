import React from 'react';
import { Skeleton } from './ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from './ui/card';

const LoadingSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-24" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-24" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-96 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-6 w-24" />
      </CardFooter>
    </Card>
  );
};

export default LoadingSkeleton;
