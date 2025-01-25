import { Link } from "react-router-dom";

interface FavoriteItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

interface FavoriteItemsProps {
  items: FavoriteItem[];
}

export function FavoriteItems({ items }: FavoriteItemsProps) {
  return (
    <div>
      <h3 className="px-4 text-sm font-semibold text-muted-foreground mb-2">
        Favorites
      </h3>
      <nav className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className="sidebar-item"
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}