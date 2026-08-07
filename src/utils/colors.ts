export interface ColorTheme {
  bg: string;
  border: string;
  text: string;
  gradient: string;
  lightBg: string;
}

export const colorThemes: Record<string, ColorTheme> = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400/80",
    gradient: "from-emerald-500/[0.03] to-transparent",
    lightBg: "bg-emerald-500/[0.03]",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-400/80",
    gradient: "from-red-500/[0.03] to-transparent",
    lightBg: "bg-red-500/[0.03]",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400/80",
    gradient: "from-blue-500/[0.03] to-transparent",
    lightBg: "bg-blue-500/[0.03]",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400/80",
    gradient: "from-amber-500/[0.03] to-transparent",
    lightBg: "bg-amber-500/[0.03]",
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400/80",
    gradient: "from-violet-500/[0.03] to-transparent",
    lightBg: "bg-violet-500/[0.03]",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-400/80",
    gradient: "from-rose-500/[0.03] to-transparent",
    lightBg: "bg-rose-500/[0.03]",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400/80",
    gradient: "from-cyan-500/[0.03] to-transparent",
    lightBg: "bg-cyan-500/[0.03]",
  },
  pink: {
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    text: "text-pink-400/80",
    gradient: "from-pink-500/[0.03] to-transparent",
    lightBg: "bg-pink-500/[0.03]",
  },
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    text: "text-indigo-400/80",
    gradient: "from-indigo-500/[0.03] to-transparent",
    lightBg: "bg-indigo-500/[0.03]",
  },
};

export const getTheme = (color: string): ColorTheme => {
  return colorThemes[color] || colorThemes.blue;
};