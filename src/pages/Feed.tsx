import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Repeat2, Share } from "lucide-react";

const feedData = [
  {
    id: 1,
    author: "TechNews Daily",
    handle: "@technews",
    avatar: "public/lovable-uploads/bce6eb86-fcb7-4b63-905a-1580b4214170.png",
    content: "Breaking: New AI breakthrough allows for more efficient natural language processing. This could revolutionize how we interact with machines. #AI #Technology",
    time: "2h ago",
    likes: 1234,
    comments: 89,
    reposts: 234
  },
  {
    id: 2,
    author: "Gaming Universe",
    handle: "@gaming_universe",
    avatar: "public/lovable-uploads/cab84582-4074-489d-96fe-b5a12ca77fc4.png",
    content: "The latest gaming trends show a surge in VR adoption. What's your take on the future of virtual reality gaming? 🎮 #Gaming #VR",
    time: "4h ago",
    likes: 892,
    comments: 156,
    reposts: 76
  }
];

const Feed = () => {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 border-l border-border">
        <div className="max-w-2xl mx-auto">
          <div className="border-b border-border p-4">
            <h1 className="text-2xl font-bold">Feed</h1>
          </div>
          
          <div className="divide-y divide-border">
            {feedData.map((post) => (
              <div key={post.id} className="p-4 hover:bg-secondary/50 transition-colors">
                <div className="flex gap-4">
                  <Avatar className="w-12 h-12">
                    <img src={post.avatar} alt={post.author} className="object-cover" />
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{post.author}</span>
                      <span className="text-muted-foreground">{post.handle}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{post.time}</span>
                    </div>
                    
                    <p className="mt-2 text-sm">{post.content}</p>
                    
                    <div className="flex gap-6 mt-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500">
                        <Repeat2 className="w-4 h-4 mr-2" />
                        {post.reposts}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                        <Heart className="w-4 h-4 mr-2" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
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

export default Feed;