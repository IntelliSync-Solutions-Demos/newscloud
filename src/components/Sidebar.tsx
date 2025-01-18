import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

const sidebarItems = [
  { id: 'today', label: 'Today', icon: '📰', path: '/' },
  { id: 'feed', label: 'Feed', icon: '💭', path: '/feed' },
  { id: 'videos', label: 'Videos', icon: '🎥', path: '/videos' },
  { id: 'news-plus', label: 'News+', icon: '⭐', path: '#' },
  { id: 'sports', label: 'Sports', icon: '🏈', path: '#' },
  { id: 'puzzles', label: 'Puzzles', icon: '🧩', path: '#' },
  { id: 'shared', label: 'Shared with You', icon: '👥', path: '#' },
  { id: 'saved', label: 'Saved Stories', icon: '🔖', path: '#' },
  { id: 'history', label: 'History', icon: '📅', path: '#' },
];

const favoriteItems = [
  { id: 'bleacher', label: 'Bleacher Report', icon: '📊', path: '#' },
  { id: 'politics', label: 'Politics', icon: '🏛️', path: '#' },
  { id: 'cowboys', label: 'Dallas Cowboys', icon: '🏈', path: '#' },
  { id: 'ctv', label: 'CTV News', icon: '📺', path: '#' },
  { id: 'canadiens', label: 'Montreal Canadiens', icon: '🏒', path: '#' },
  { id: 'cbc', label: 'CBC News', icon: '📰', path: '#' },
];

export function Sidebar() {
  const location = useLocation();

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
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "sidebar-item",
                location.pathname === item.path && "active"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div>
          <h3 className="px-4 text-sm font-semibold text-muted-foreground mb-2">
            Favorites
          </h3>
          <nav className="space-y-1">
            {favoriteItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="sidebar-item"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}