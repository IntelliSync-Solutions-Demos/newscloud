import { Sidebar } from "@/components/Sidebar";

const puzzles = [
  {
    id: 1,
    title: "Daily Crossword",
    difficulty: "Medium",
    completionRate: "45%",
    type: "Crossword"
  },
  {
    id: 2,
    title: "Word Search",
    difficulty: "Easy",
    completionRate: "78%",
    type: "Word"
  }
];

const Puzzles = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Puzzles</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {puzzles.map((puzzle) => (
              <div
                key={puzzle.id}
                className="p-6 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <h3 className="text-xl font-semibold mb-2">{puzzle.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{puzzle.difficulty}</span>
                  <span>•</span>
                  <span>{puzzle.completionRate} completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Puzzles;