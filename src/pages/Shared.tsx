import { Sidebar } from "@/components/Sidebar";

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

const Shared = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Shared with You</h1>
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
      </main>
    </div>
  );
};

export default Shared;