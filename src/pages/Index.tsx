import { Sidebar } from "@/components/Sidebar";
import { NewsCard } from "@/components/NewsCard";

const newsData = [
  {
    id: 1,
    title: "These 'Gourmet' Flavored Potato Chips at Costco Are So Good, Shoppers Are Buying 3 Bags at a Time",
    source: "Kitchn",
    time: "1h ago",
    image: "public/lovable-uploads/8754ef9b-3eaa-459e-837b-584e3aaffc85.png"
  },
  {
    id: 2,
    title: "UCLA's Mick Cronin Goes on Colorful Postgame Rant When Asked About Big Ten Schedule",
    source: "Sports Illustrated",
    time: "33m ago",
    image: "public/lovable-uploads/d83f5c1f-14c5-4fb6-a002-4f058440aab8.png"
  },
  {
    id: 3,
    title: "Stanley Cup odds: Will a Canadian NHL team win it all this year?",
    source: "Daily Hive",
    time: "15h ago",
    image: "public/lovable-uploads/805355d2-d3d6-47c6-8348-c96fd5954a59.png"
  },
  {
    id: 4,
    title: "Palestinians dare to hope the fighting really stops this time",
    source: "Wall Street Journal",
    time: "1h ago",
    image: "public/lovable-uploads/19be3674-e34a-4570-b7f8-23c55228ad09.png"
  }
];

const Index = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Today</h1>
          
          <div className="grid grid-cols-4 gap-6">
            <NewsCard {...newsData[0]} size="large" />
            {newsData.slice(1).map((news) => (
              <NewsCard key={news.id} {...news} size="medium" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;