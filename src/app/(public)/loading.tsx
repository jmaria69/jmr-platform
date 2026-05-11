import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      {/* Hero skeleton */}
      <div className="mx-auto max-w-3xl text-center space-y-6">
        <Skeleton className="h-8 w-48 mx-auto rounded-full" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-6 w-3/4 mx-auto" />
        <div className="flex gap-4 justify-center pt-4">
          <Skeleton className="h-12 w-40 rounded-xl" />
          <Skeleton className="h-12 w-32 rounded-xl" />
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-24">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl glass p-6 space-y-4">
            <Skeleton className="h-1 w-full rounded-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
