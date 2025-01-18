import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  views: number;
  createdAt: Date;
}

export const VideoCard = ({
  title,
  thumbnail,
  channel,
  views,
  createdAt,
}: VideoCardProps) => {
  return (
    <Card className="overflow-hidden bg-card hover:bg-secondary/50 transition-colors cursor-pointer">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{channel}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <span>{views.toLocaleString()} views</span>
          <span>•</span>
          <span>{formatDistanceToNow(createdAt)} ago</span>
        </div>
      </div>
    </Card>
  );
};