import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crossword } from "@/components/Crossword";
import { Sudoku } from "@/components/Sudoku";
import { Wordle } from "@/components/Wordle";

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

export default function Puzzles() {
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <ScrollArea className="h-full w-full p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Puzzle Collection</CardTitle>
        </CardHeader>
        <Separator className="mb-4" />
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input 
              type="text" 
              placeholder="Search puzzles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={() => alert('Search functionality coming soon!')}>
              Search
            </Button>
          </div>

          <Tabs defaultValue="crossword" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="crossword">Crossword</TabsTrigger>
              <TabsTrigger value="sudoku">Sudoku</TabsTrigger>
              <TabsTrigger value="wordle">Wordle</TabsTrigger>
            </TabsList>
            <TabsContent value="crossword">
              <Crossword />
            </TabsContent>
            <TabsContent value="sudoku">
              <Sudoku />
            </TabsContent>
            <TabsContent value="wordle">
              <Wordle />
            </TabsContent>
          </Tabs>

          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {puzzles.map((puzzle) => (
              <Card key={puzzle.id}>
                <CardHeader>
                  <CardTitle>{puzzle.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>Difficulty: {puzzle.difficulty}</p>
                    <p>Completion Rate: {puzzle.completionRate}</p>
                    <Button variant="outline">Start Puzzle</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </ScrollArea>
  );
}