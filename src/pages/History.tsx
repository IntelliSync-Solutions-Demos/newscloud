import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Clock, X } from "lucide-react";

const historyItems = [
  {
    id: 1,
    title: "The Impact of AI on Modern Society",
    visitedAt: "Today at 2:30 PM",
    source: "Tech Insights"
  },
  {
    id: 2,
    title: "Global Economic Trends 2024",
    visitedAt: "Yesterday at 4:15 PM",
    source: "Financial Times"
  }
];

const History = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">History</h1>
            <Button variant="outline">Clear History</Button>
          </div>
          <div className="space-y-4">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{item.visitedAt}</span>
                      <span>•</span>
                      <span>{item.source}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
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

export default History;