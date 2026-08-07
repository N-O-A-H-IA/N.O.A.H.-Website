import { FileText } from "lucide-react";
import type { TocItem } from "@/data/privacyData";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  return (
    <div className="bg-white/[0.03] rounded-2xl p-8 border border-white/10 scroll-mt-24" id="sommaire">
      <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 text-violet-400/80" />
        Table des matières
      </h3>
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((item) => (
          <a
            key={item.num}
            href={`#${item.id}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all group"
          >
            <div className="w-6 h-6 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-500/20 transition">
              <span className="text-xs font-bold text-violet-400/80">{item.num}</span>
            </div>
            <span className="text-base text-white group-hover:text-white transition">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}