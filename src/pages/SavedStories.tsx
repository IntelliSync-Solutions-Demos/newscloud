import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

const savedStories = [
  {
    id: 1,
    title: "The Future of Sustainable Energy",
    source: "Tech Review",
    savedAt: "2 days ago",
    category: "Technology"
  },
  {
    id: 2,
    title: "Understanding Modern Art Movements",
    source: "Art Weekly",
    savedAt: "1 week ago",
    category: "Arts"
  }
];

const SavedStories = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Saved Stories</h1>
          <div className="space-y-4">
            {savedStories.map((story) => (
              <div
                key={story.id}
                className="p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{story.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{story.source}</span>
                      <span>•</span>
                      <span>{story.savedAt}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SavedStories;