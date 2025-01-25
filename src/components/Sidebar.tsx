import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UploadModal } from "./UploadModal";
import { useState } from "react";

const sidebarItems = [
  { id: 'today', label: 'Today', icon: '📰', path: '/' },
  { id: 'feed', label: 'Feed', icon: '💭', path: '/feed' },
  { id: 'videos', label: 'Videos', icon: '🎥', path: '/videos' },
  { id: 'news-plus', label: 'News+', icon: '⭐', path: '/news-plus' },
  { id: 'sports', label: 'Sports', icon: '🏈', path: '/sports' },
  { id: 'puzzles', label: 'Puzzles', icon: '🧩', path: '/puzzles' },
  { id: 'shared', label: 'Shared with You', icon: '👥', path: '/shared' },
  { id: 'saved', label: 'Saved Stories', icon: '🔖', path: '/saved' },
  { id: 'history', label: 'History', icon: '📅', path: '/history' },
];

const favoriteItems = [
  { id: 'bleacher', label: 'Bleacher Report', icon: '📊', path: '/favorites/bleacher' },
  { id: 'politics', label: 'Politics', icon: '🏛️', path: '/favorites/politics' },
  { id: 'cowboys', label: 'Dallas Cowboys', icon: '🏈', path: '/favorites/cowboys' },
  { id: 'ctv', label: 'CTV News', icon: '📺', path: '/favorites/ctv' },
  { id: 'canadiens', label: 'Montreal Canadiens', icon: '🏒', path: '/favorites/canadiens' },
  { id: 'cbc', label: 'CBC News', icon: '📰', path: '/favorites/cbc' },
];

export function Sidebar() {
  const location = useLocation();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

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

        <Button 
          onClick={() => setUploadModalOpen(true)}
          className="w-full bg-primary"
        >
          Upload Content
        </Button>

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

      <UploadModal 
        open={uploadModalOpen} 
        onOpenChange={setUploadModalOpen} 
      />
    </div>
  );
}