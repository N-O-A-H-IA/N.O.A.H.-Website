import type { LucideIcon } from "lucide-react";
import { XCircle } from "lucide-react";
import { BoldText } from "@/components/BoldText";

interface NotCollectedCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  details: string[];
  items: string[];
  color: string;
}

export function NotCollectedCard({ icon: Icon, title, subtitle, details, items }: NotCollectedCardProps) {
  return (
    <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/10">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-red-400/80" />
        </div>
        <div>
          <h4 className="font-semibold text-white mb-1">{title}</h4>
          <p className="text-sm text-red-400/70">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-1 mb-4">
        {details.map((line, idx) => (
          <p key={idx} className="text-base text-white leading-relaxed">
            <BoldText text={line} />
          </p>
        ))}
      </div>
      <div className="space-y-2">
        <div className="text-sm font-semibold text-red-400/80 mb-2 flex items-center gap-2">
          <XCircle className="w-4 h-4" />
          Données NON collectées :
        </div>
        <ul className="space-y-1.5">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-white">
              <XCircle className="w-3.5 h-3.5 text-red-400/60 flex-shrink-0 mt-0.5" />
              <span><BoldText text={item} /></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}