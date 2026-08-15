import { useMemo } from "react";

interface CategoryFiltersProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export const CategoryFilters = ({
  categories,
  activeCategory,
  onCategoryChange,
  className = "",
}: CategoryFiltersProps) => {
  const allCategories = useMemo(
    () => ["All", ...categories],
    [categories]
  );

  return (
    <div className={`flex flex-wrap gap-3 md:gap-4 justify-center ${className}`}>
      {allCategories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-2 rounded-full transition-all duration-300 font-semibold text-sm tracking-wide uppercase ${
            activeCategory === category
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
              : "bg-secondary text-foreground hover:bg-secondary/80 border border-border hover:border-primary/30"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
