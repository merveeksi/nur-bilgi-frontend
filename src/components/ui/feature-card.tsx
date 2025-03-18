import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  emoji?: string;
  className?: string;
  link?: string;
}

/**
 * Reusable feature card component to display features consistently
 */
export function FeatureCard({
  title,
  description,
  icon,
  emoji,
  className,
  link,
}: FeatureCardProps) {
  const CardContent = () => (
    <>
      {/* Icon or Emoji */}
      {icon ? (
        <div className="text-emerald-600 dark:text-emerald-400 mb-4">
          {icon}
        </div>
      ) : emoji ? (
        <div className="text-3xl mb-4 text-emerald-600 dark:text-emerald-400">
          {emoji}
        </div>
      ) : null}
      
      {/* Title */}
      <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-300">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300">
        {description}
      </p>
    </>
  );

  // Link varsa card'ı link içerisinde render et
  if (link) {
    return (
      <Link href={link} className={cn(
        "block p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow hover:bg-gray-50 dark:hover:bg-slate-700",
        className
      )}>
        <CardContent />
      </Link>
    );
  }

  // Link yoksa normal div olarak render et
  return (
    <div className={cn(
      "p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow",
      className
    )}>
      <CardContent />
    </div>
  );
}

export default FeatureCard; 