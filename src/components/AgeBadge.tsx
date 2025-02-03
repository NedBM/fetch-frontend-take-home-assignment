import { Badge } from "@/components/ui/badge"

interface AgeBadgeProps {
  age: number;
}

const getAgeCategory = (age: number) => {
  if (age <= 1) return { label: 'Puppy', className: 'text-rose-700 bg-rose-100' };
  if (age <= 3) return { label: 'Young', className: 'text-emerald-700 bg-emerald-100' };
  if (age <= 7) return { label: 'Adult', className: 'text-blue-700 bg-blue-100' };
  return { label: 'Senior', className: 'text-violet-700 bg-violet-100' };
};

const getAgeText = (age: number) => {
    if (age === 0) return 'newborn';
    const yearText = age === 1 ? 'year' : 'years';
    return `${age} ${yearText}`;
  };

export const AgeBadge = ({ age }: AgeBadgeProps) => {
    const { label, className } = getAgeCategory(age);
    const ageText = getAgeText(age);
    
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{ageText}</span>
        <Badge className={className}>
          {label}
        </Badge>
      </div>
    );
  };