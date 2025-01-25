import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="search"
        placeholder="Search"
        className="w-full bg-secondary pl-9 pr-4 py-2 text-sm rounded-md border-0 focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}