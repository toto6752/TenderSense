import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
      className={cn("bg-slate-50/50 rounded-xl overflow-hidden relative", className)}
      {...(props as any)}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </motion.div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-12 w-36 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-8 rounded-[1.5rem] border border-slate-200">
            <Skeleton className="w-12 h-12 rounded-[14px] mb-8" />
            <Skeleton className="h-3 w-24 mb-4" />
            <Skeleton className="h-8 w-16 mb-4" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-6">
            <Skeleton className="h-6 w-48" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 bg-white border border-slate-200 rounded-3xl space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-4 mt-8">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside className="space-y-10">
          <Skeleton className="h-80 w-full rounded-[32px]" />
          <Skeleton className="h-64 w-full rounded-[32px]" />
        </aside>
      </div>
    </div>
  );
}
