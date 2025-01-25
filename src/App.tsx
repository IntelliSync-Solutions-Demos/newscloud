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
import Memories from '@/pages/Memories';

// Import Personal Pages
import PersonalPhotos from "./pages/personal/Photos";
import PersonalDates from "./pages/personal/Dates";
import PersonalRecipes from "./pages/personal/Recipes";
import PersonalFinances from "./pages/personal/Finances";
import PersonalShopping from "./pages/personal/Shopping";

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/feed" element={<Layout><Feed /></Layout>} />
          <Route path="/videos" element={<Layout><Videos /></Layout>} />
          <Route path="/news-plus" element={<Layout><NewsPlus /></Layout>} />
          <Route path="/sports" element={<Layout><Sports /></Layout>} />
          <Route path="/puzzles" element={<Layout><Puzzles /></Layout>} />
          <Route path="/shared" element={<Layout><Shared /></Layout>} />
          <Route path="/saved" element={<Layout><SavedStories /></Layout>} />
          <Route path="/history" element={<Layout><History /></Layout>} />
          <Route path="/ai" element={<Layout><AI /></Layout>} />
          <Route path="/memories" element={<Layout><Memories /></Layout>} />
          
          {/* Personal Subcategory Routes */}
          <Route path="/personal/photos" element={<Layout><PersonalPhotos /></Layout>} />
          <Route path="/personal/dates" element={<Layout><PersonalDates /></Layout>} />
          <Route path="/personal/recipes" element={<Layout><PersonalRecipes /></Layout>} />
          <Route path="/personal/finances" element={<Layout><PersonalFinances /></Layout>} />
          <Route path="/personal/shopping" element={<Layout><PersonalShopping /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;