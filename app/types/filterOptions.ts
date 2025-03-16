import { FC } from 'react';

/**
 * Represents a filter category in the application
 */
export type FilterCategory = 'people' | 'companies' | 'opportunities';

/**
 * Represents a filter component that can be used in the application
 */
export interface FilterOption {
  /**
   * The category this filter belongs to
   */
  filterCategory: FilterCategory;
  
  /**
   * The unique identifier for this filter
   */
  filterName: string;
  
  /**
   * The React component that implements this filter
   */
  filterComponent: FC;
}

/**
 * Type for an array of filter options
 */
export type FilterOptions = FilterOption[]; 