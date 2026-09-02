"use client";

import { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    className?: string;
    children: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <select
                ref={ref}
                className={`w-full bg-noah-panel border border-noah-border rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-noah-violet/50 ${className || ""}`}
                {...props}
            >
                {children}
            </select>
        );
    }
);

Select.displayName = "Select";