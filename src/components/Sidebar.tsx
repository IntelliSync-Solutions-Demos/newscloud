import { useState } from "react";
import { useLocation } from "react-router-dom";
import { SearchBar } from "./sidebar/SearchBar";
import { UploadButton } from "./sidebar/UploadButton";
import { NavigationItems } from "./sidebar/NavigationItems";
import { FavoriteItems } from "./sidebar/FavoriteItems";
import { UploadModal } from "./UploadModal";

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
  { id: 'ai-chat', label: 'AI Chat', icon: '🤖', path: '/ai' },
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
        <SearchBar />
        
        <UploadButton onClick={() => setUploadModalOpen(true)} />

        <NavigationItems 
          items={sidebarItems} 
          currentPath={location.pathname} 
        />

        <FavoriteItems items={favoriteItems} />
      </div>

      <UploadModal 
        open={uploadModalOpen} 
        onOpenChange={setUploadModalOpen} 
      />
    </div>
  );
}
