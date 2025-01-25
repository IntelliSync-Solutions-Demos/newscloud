import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import Videos from "./pages/Videos";
import NewsPlus from "./pages/NewsPlus";
import Sports from "./pages/Sports";
import Puzzles from "./pages/Puzzles";
import Shared from "./pages/Shared";
import SavedStories from "./pages/SavedStories";
import History from "./pages/History";
import { AI } from "./pages/AI";

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background">
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
            <Route path="/ai" element={<AI />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;