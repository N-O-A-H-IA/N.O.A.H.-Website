import type { LucideIcon } from "lucide-react";
import { getTheme } from "@/utils/colors";

interface SectionHeaderProps {
  icon: LucideIcon;
  number?: number;
  title: string;
  color: string;
  id?: string;
}

export function SectionHeader({ icon: Icon, number, title, color, id }: SectionHeaderProps) {
  const theme = getTheme(color);

  return (
    <div id={id} className="flex items-center gap-3 mb-6 scroll-mt-24">
      <div className={`w-10 h-10 rounded-lg ${theme.bg} ${theme.border} border flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${theme.text}`} />
      </div>
      <h2 className="font-display text-2xl font-bold text-white">
        {number ? `${number}. ` : ""}
        {title}
      </h2>
    </div>
  );
}