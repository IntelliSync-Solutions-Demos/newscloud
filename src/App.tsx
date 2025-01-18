import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Videos from "./pages/Videos";
import Feed from "./pages/Feed";
import NewsPlus from "./pages/NewsPlus";
import Sports from "./pages/Sports";
import Puzzles from "./pages/Puzzles";
import Shared from "./pages/Shared";
import SavedStories from "./pages/SavedStories";
import History from "./pages/History";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/news-plus" element={<NewsPlus />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/puzzles" element={<Puzzles />} />
            <Route path="/shared" element={<Shared />} />
            <Route path="/saved" element={<SavedStories />} />
            <Route path="/history" element={<History />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;