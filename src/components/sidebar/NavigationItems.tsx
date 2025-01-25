import React from 'react';
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationItem {
  id: string;
  label: string;
  icon: string | React.ReactNode;
  path: string;
}

interface NavigationItemsProps {
  items: NavigationItem[];
  currentPath: string;
}

export function NavigationItems({ items, currentPath }: NavigationItemsProps) {
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <Link
          key={item.id}
          to={item.path}
          className={cn(
            "sidebar-item",
            currentPath === item.path && "active"
          )}
        >
          <span className="text-lg">
            {typeof item.icon === 'string' ? item.icon : item.icon}
          </span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}