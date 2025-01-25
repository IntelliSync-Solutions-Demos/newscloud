import React from "react";

const sharedItems = [
  {
    id: 1,
    title: "The Rise of Remote Work Culture",
    sharedBy: "John Doe",
    sharedAt: "2 hours ago",
    preview: "An interesting take on how remote work is shaping modern workplace culture..."
  },
  {
    id: 2,
    title: "New Discoveries in Space Exploration",
    sharedBy: "Jane Smith",
    sharedAt: "1 day ago",
    preview: "NASA's latest findings suggest the possibility of..."
  }
];

export default function Shared() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Shared Stories</h1>
      <div className="space-y-4">
        {sharedItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors"
          >
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{item.preview}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{item.sharedBy}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{item.sharedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}