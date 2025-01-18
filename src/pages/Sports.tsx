import { Sidebar } from "@/components/Sidebar";

const sportsData = [
  {
    id: 1,
    league: "NFL",
    match: "Cowboys vs Eagles",
    score: "24 - 21",
    status: "Live",
    quarter: "4th"
  },
  {
    id: 2,
    league: "NBA",
    match: "Lakers vs Warriors",
    score: "98 - 95",
    status: "Final",
    highlight: "LeBron's game-winning shot"
  }
];

const Sports = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Sports</h1>
          <div className="grid gap-4">
            {sportsData.map((game) => (
              <div
                key={game.id}
                className="p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium text-primary">{game.league}</span>
                    <h3 className="text-lg font-semibold">{game.match}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{game.score}</div>
                    <span className="text-sm text-muted-foreground">
                      {game.status} {game.quarter && `• ${game.quarter}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sports;