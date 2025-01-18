import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { id: 'today', label: 'Today', icon: '📰' },
  { id: 'news-plus', label: 'News+', icon: '⭐' },
  { id: 'sports', label: 'Sports', icon: '🏈' },
  { id: 'puzzles', label: 'Puzzles', icon: '🧩' },
  { id: 'shared', label: 'Shared with You', icon: '👥' },
  { id: 'saved', label: 'Saved Stories', icon: '🔖' },
  { id: 'history', label: 'History', icon: '📅' },
];

const favoriteItems = [
  { id: 'bleacher', label: 'Bleacher Report', icon: '📊' },
  { id: 'politics', label: 'Politics', icon: '🏛️' },
  { id: 'cowboys', label: 'Dallas Cowboys', icon: '🏈' },
  { id: 'ctv', label: 'CTV News', icon: '📺' },
  { id: 'canadiens', label: 'Montreal Canadiens', icon: '🏒' },
  { id: 'cbc', label: 'CBC News', icon: '📰' },
];

export function Sidebar() {
  return (
    <div className="w-64 h-screen flex-shrink-0 border-r border-border bg-card overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search"
            className="w-full bg-secondary pl-9 pr-4 py-2 text-sm rounded-md border-0 focus:ring-1 focus:ring-primary"
          />
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <a
              key={item.id}
              href="#"
              className={cn(
                "sidebar-item",
                item.id === 'today' && "active"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div>
          <h3 className="px-4 text-sm font-semibold text-muted-foreground mb-2">
            Favorites
          </h3>
          <nav className="space-y-1">
            {favoriteItems.map((item) => (
              <a
                key={item.id}
                href="#"
                className="sidebar-item"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}