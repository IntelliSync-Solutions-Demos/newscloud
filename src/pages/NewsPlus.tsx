import { Sidebar } from "@/components/Sidebar";

const newsItems = [
  {
    id: 1,
    title: "Premium: The Future of AI in Healthcare",
    description: "An in-depth analysis of how artificial intelligence is revolutionizing medical diagnosis and treatment.",
    category: "Technology",
    readTime: "8 min read",
    premium: true
  },
  {
    id: 2,
    title: "Premium: Climate Change: A Comprehensive Report",
    description: "Latest findings and predictions about global climate patterns and their impact on society.",
    category: "Environment",
    readTime: "12 min read",
    premium: true
  }
];

const NewsPlus = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">News+</h1>
          <div className="grid gap-6">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                    {item.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewsPlus;