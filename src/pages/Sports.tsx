import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Sports</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sportsData.map((game) => (
          <Card key={game.id}>
            <CardHeader>
              <CardTitle>{game.match}</CardTitle>
              <span className="text-sm text-muted-foreground">{game.league}</span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{game.score}</p>
              <p className="text-sm text-muted-foreground">{game.status} {game.quarter && `• ${game.quarter}`}</p>
              <div className="mt-4">
                <Button variant="outline" size="sm">Read More</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Sports;