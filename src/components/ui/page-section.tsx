import React from "react";
import { cn } from "@/lib/utils";

interface PageSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  containerClassName?: string;
  variant?: "default" | "alternate" | "highlight";
  id?: string;
}

/**
 * Reusable page section component to maintain consistent styling across the application
 */
export function PageSection({
  children,
  title,
  subtitle,
  className,
  containerClassName,
  variant = "default",
  id,
}: PageSectionProps) {
  // Different background styles based on variant
  const variantStyles = {
    default: "bg-white dark:bg-slate-900",
    alternate: "bg-gray-100 dark:bg-gray-800",
    highlight: "bg-emerald-50 dark:bg-emerald-900/20",
  };

  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-20",
        variantStyles[variant],
        className
      )}
    >
      <div className={cn(
        "container mx-auto px-4 md:px-6",
        containerClassName
      )}>
        {/* Section header */}
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold text-emerald-800 dark:text-emerald-300 mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-emerald-700 dark:text-emerald-400 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        {/* Section content */}
        {children}
      </div>
    </section>
  );
}

export default PageSection; 