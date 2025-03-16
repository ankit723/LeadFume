'use client';

import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from 'react';

const SearchBar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleClick = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      router.push(`/customize?query=${searchQuery}`);
    }
  };

  return (
    <div 
      className="relative w-full mx-auto cursor-pointer"
    >
      <Input
        className="w-full h-10 pl-12 pr-4 text-sm md:text-base shadow-md rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
        placeholder="Quick Search"
        onKeyDown={(e)=>handleClick(e)}
        onChange={(e)=>setSearchQuery(e.target.value)}
        value={searchQuery}
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground dark:text-gray-400" />
    </div>
  );
};

export default SearchBar; 