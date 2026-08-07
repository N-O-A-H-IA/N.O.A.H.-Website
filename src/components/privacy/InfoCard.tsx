import type { LucideIcon } from "lucide-react";
import { getTheme } from "@/utils/colors";
import { BoldText } from "@/components/BoldText";

interface InfoCardProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  details: string[];
  color: string;
  variant?: "default" | "compact";
}

export function InfoCard({ icon: Icon, title, subtitle, details, color, variant = "default" }: InfoCardProps) {
  const theme = getTheme(color);

  return (
    <div className={`bg-gradient-to-br ${theme.gradient} rounded-2xl p-6 border border-white/10`}>
      <div className="flex items-start gap-4">
        {Icon && (
          <div className={`w-10 h-10 rounded-lg ${theme.bg} ${theme.border} border flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${theme.text}`} />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{title}</h4>
          {subtitle && <p className={`text-sm ${theme.text} mb-3`}>{subtitle}</p>}
          <div className="space-y-1">
            {details.map((line, idx) => (
              <p key={idx} className="text-base text-white leading-relaxed">
                <BoldText text={line} />
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function InfoCardCompact({ icon: Icon, title, subtitle, details, color }: InfoCardProps) {
  const theme = getTheme(color);

  return (
    <div className={`bg-gradient-to-br ${theme.gradient} rounded-2xl p-6 border border-white/10`}>
      <div className="flex items-start gap-3 mb-4">
        {Icon && (
          <div className={`w-10 h-10 rounded-lg ${theme.bg} ${theme.border} border flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${theme.text}`} />
          </div>
        )}
        <div>
          <h4 className="font-semibold text-white mb-1">{title}</h4>
          {subtitle && <p className={`text-sm ${theme.text}`}>{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-1">
        {details.map((line, idx) => (
          <p key={idx} className="text-base text-white leading-relaxed">
            <BoldText text={line} />
          </p>
        ))}
      </div>
    </div>
  );
}