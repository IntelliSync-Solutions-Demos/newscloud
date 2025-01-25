import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, MemoryStick, ChevronsLeft, ChevronsRight } from "lucide-react";
import { SearchBar } from "./sidebar/SearchBar";
import { UploadButton } from "./sidebar/UploadButton";
import { NavigationItems } from "./sidebar/NavigationItems";
import { FavoriteItems } from "./sidebar/FavoriteItems";
import { UploadModal } from "./UploadModal";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase'; 
import { useAuth } from '../contexts/AuthContext'; 

const sidebarItems = [
  { id: 'today', label: 'Today', icon: '📰', path: '/' },
  { id: 'feed', label: 'Feed', icon: '💭', path: '/feed' },
  { id: 'news-plus', label: 'News+', icon: '⭐', path: '/news-plus' },
  { id: 'sports', label: 'Sports', icon: '🏈', path: '/sports' },
  { id: 'puzzles', label: 'Puzzles', icon: '🧩', path: '/puzzles' },
  { id: 'shared', label: 'Shared with You', icon: '👥', path: '/shared' },
  { id: 'saved', label: 'Saved Stories', icon: '🔖', path: '/saved' },
  { id: 'history', label: 'History', icon: '📅', path: '/history' },
  { id: 'ai-chat', label: 'AI Chat', icon: '🤖', path: '/ai' },
];

const personalItems = [
  { 
    id: 'personal-photos', 
    label: 'Photos', 
    icon: '📸', 
    path: '/personal/photos',
    description: 'Manage and organize your personal photos'
  },
  { 
    id: 'personal-dates', 
    label: 'Dates', 
    icon: '❤️', 
    path: '/personal/dates',
    description: 'Track and manage important dates'
  },
  { 
    id: 'personal-recipes', 
    label: 'Recipes', 
    icon: '🍳', 
    path: '/personal/recipes',
    description: 'Save and organize your favorite recipes'
  },
  { 
    id: 'personal-finances', 
    label: 'Personal Finances', 
    icon: '💰', 
    path: '/personal/finances',
    description: 'Track and manage your financial information'
  },
  { 
    id: 'personal-shopping', 
    label: 'Shopping', 
    icon: '🛒', 
    path: '/personal/shopping',
    description: 'Amazon API Integration for shopping' 
  },
  {
    id: 'personal-videos',
    label: 'Videos',
    icon: '🎥',
    path: '/videos',
    description: 'Your personal video collection'
  },
  {
    id: 'personal-memories',
    label: 'Memories',
    icon: <MemoryStick size={16} />,
    path: '/memories',
    description: 'Your personal memories and moments'
  },
];

export function Sidebar() {
  const location = useLocation();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isPersonalOpen, setIsPersonalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [personalItemsOrder, setPersonalItemsOrder] = useState<typeof personalItems>(personalItems);
  const { user } = useAuth(); 

  useEffect(() => {
    const loadPersistedOrder = async () => {
      if (!user) return;

      // Temporarily bypass Supabase call and use default order
      setPersonalItemsOrder(personalItems);
    };

    loadPersistedOrder();
  }, [user]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarVariants = {
    expanded: { width: '16rem', transition: { duration: 0.3 } },
    collapsed: { width: '4rem', transition: { duration: 0.3 } }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const newPersonalItems = Array.from(personalItemsOrder);
    const [reorderedItem] = newPersonalItems.splice(result.source.index, 1);
    newPersonalItems.splice(result.destination.index, 0, reorderedItem);

    setPersonalItemsOrder(newPersonalItems);

    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_sidebar_preferences')
        .upsert([
          {
            user_id: user.id,
            personal_favorites_order: newPersonalItems.map(item => item.id)
          }
        ], {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Failed to save sidebar preferences', error);
        setPersonalItemsOrder(personalItemsOrder);
      }
    } catch (err) {
      console.error('Error saving sidebar preferences', err);
    }
  };

  return (
    <motion.div 
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      className="h-screen flex-shrink-0 border-r border-border bg-card overflow-hidden relative group"
    >
      <button 
        onClick={toggleSidebar} 
        className="absolute bottom-4 right-4 z-20 bg-background border border-border rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors shadow-sm hover:shadow-md"
      >
        {isCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
      </button>

      <div className="relative h-full flex flex-col">
        <div className={`flex-shrink-0 p-4 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
          <SearchBar />
          
          <UploadButton onClick={() => setUploadModalOpen(true)} />
        </div>

        <div 
          className={`flex-grow overflow-y-auto scrollbar-thin scrollbar-track-background scrollbar-thumb-muted-foreground ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}
        >
          <NavigationItems 
            items={sidebarItems} 
            currentPath={location.pathname} 
          />

          {/* Personal Favorites Dropdown */}
          <div className="px-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Favorites
            </h3>
            <nav className="space-y-1">
              <div 
                className="sidebar-item flex justify-between items-center cursor-pointer"
                onClick={() => setIsPersonalOpen(!isPersonalOpen)}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">👤</span>
                  {!isCollapsed && <span>Personal</span>}
                </div>
                {!isCollapsed && (isPersonalOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
              </div>
              
              {!isCollapsed && isPersonalOpen && (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="personal-favorites">
                    {(provided) => (
                      <div 
                        {...provided.droppableProps} 
                        ref={provided.innerRef} 
                        className="pl-6 space-y-1"
                      >
                        {personalItemsOrder.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="flex items-center"
                              >
                                <Link
                                  to={item.path}
                                  className="sidebar-item block flex-grow"
                                  title={item.description}
                                >
                                  <div className="flex items-center">
                                    <span className="text-lg mr-2">{item.icon}</span>
                                    <span>{item.label}</span>
                                  </div>
                                </Link>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </nav>
          </div>
        </div>
      </div>

      <UploadModal 
        open={uploadModalOpen} 
        onOpenChange={setUploadModalOpen} 
      />
    </motion.div>
  );
}
