import {
  LayoutDashboard,
  Database,
  Key,
  Shield,
  Lock,
  Activity,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Buckets", href: "/buckets", icon: Database },
  { label: "Keys", href: "/keys", icon: Key },
  { label: "Permissions", href: "/permissions", icon: Shield },
  { label: "Tokens", href: "/tokens", icon: Lock },
  { label: "Activity", href: "/activity", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
];
