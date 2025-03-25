export interface SidebarProps {
  onNavigate?: () => void;
}

export interface SidebarNavItemProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
  onClick?: () => void;
}
