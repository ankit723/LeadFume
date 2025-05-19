'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { XIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ActiveFiltersDisplay = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: Array<{ key: string; value: string }> = [];
  for (const [key, value] of searchParams.entries()) {
    // You might want to exclude certain params from being displayed/removable
    // e.g., if (key === 'query') continue;
    filters.push({ key, value });
  }

  if (filters.length === 0) {
    return null; // Don't render anything if no filters are active
  }

  const handleRemoveFilter = (keyToRemove: string, valueToRemove: string) => {
    const newParams = new URLSearchParams();
    let removedOneInstance = false;

    for (const [currentKey, currentValue] of searchParams.entries()) {
      if (currentKey === keyToRemove && currentValue === valueToRemove && !removedOneInstance) {
        removedOneInstance = true; 
      } else {
        newParams.append(currentKey, currentValue);
      }
    }
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const handleClearAllFilters = () => {
    router.push(pathname); // Navigate to the current path without any search params
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b mb-6 rounded-lg bg-secondary/30 dark:bg-secondary/10">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Filters:</span>
        <div className="flex flex-wrap gap-2">
          {filters.map(({ key, value }, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="group flex items-center gap-1.5 pl-2.5 pr-1 py-1 text-sm border-primary/50 bg-primary/10 text-primary-foreground hover:bg-primary/20 transition-colors duration-150 cursor-default"
            >
              <span className="font-normal">{`${key}:`}</span>
              <span className="font-semibold">{value}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0.5 rounded-full group-hover:bg-destructive/30 hover:!bg-destructive/50 transition-colors duration-150"
                onClick={() => handleRemoveFilter(key, value)}
              >
                <XIcon className="h-3.5 w-3.5" />
                <span className="sr-only">{`Remove filter ${key}: ${value}`}</span>
              </Button>
            </Badge>
          ))}
        </div>
      </div>
      {filters.length > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAllFilters}
          className="flex items-center gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50"
        >
          <Trash2Icon className="h-3.5 w-3.5" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
};

export default ActiveFiltersDisplay; 