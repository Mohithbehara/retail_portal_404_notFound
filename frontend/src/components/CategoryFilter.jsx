import { cn } from '@/lib/utils'

const CategoryFilter = ({ categories, selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium border transition-all",
          !selected
            ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/25"
            : "bg-transparent text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
        )}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium border transition-all",
            selected === cat._id
              ? "bg-primary text-primary-foreground border-transparent shadow-lg shadow-primary/25"
              : "bg-transparent text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
          )}
          onClick={() => onSelect(cat._id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
