import { cn } from "@/lib/utils";

interface NewsCardProps {
  title: string;
  source: string;
  time: string;
  image: string;
  size?: "small" | "medium" | "large";
}

export function NewsCard({ title, source, time, image, size = "medium" }: NewsCardProps) {
  return (
    <div className={cn(
      "news-card",
      size === "large" && "news-card-large",
      size === "medium" && "news-card-medium",
      size === "small" && "news-card-small"
    )}>
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 p-4 text-white">
        <div className="text-sm font-medium text-white/80 mb-1">
          {source} • {time}
        </div>
        <h3 className={cn(
          "font-semibold leading-tight",
          size === "large" && "text-2xl",
          size === "medium" && "text-lg",
          size === "small" && "text-base"
        )}>
          {title}
        </h3>
      </div>
    </div>
  );
}