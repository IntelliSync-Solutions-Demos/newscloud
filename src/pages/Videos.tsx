import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { VideoCard } from "@/components/VideoCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const categories = [
  "All",
  "JavaScript",
  "Gaming",
  "Podcasts",
  "AI",
  "Music",
  "Live",
  "Software development",
  "Playlists",
  "News",
  "Server",
  "Security",
  "Jazz piano",
];

// Mock data for initial implementation
const videos = [
  {
    id: "1",
    title: "Build and Deploy a Fullstack App with Admin Dashboard",
    thumbnail: "public/lovable-uploads/83f602ed-5b71-4512-b0ce-077687f5ad27.png",
    channel: "JavaScript Mastery",
    views: 175000,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "2",
    title: "Build a File Storage App with Role Based Authorization",
    thumbnail: "public/lovable-uploads/462447e8-76c1-467f-b5af-25b4ed2e78dc.png",
    channel: "Web Dev Cody",
    views: 188000,
    createdAt: new Date("2023-04-15"),
  },
  // Add more mock videos as needed
];

const Videos = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </ScrollArea>

            {/* Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Videos;