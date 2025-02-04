import { Combobox } from '@headlessui/react';
import { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AgeComboboxProps {
  selectedAges: string[];
  onAgesChange: (ages: string[]) => void;
}

const ageCategories = [
  { value: 'puppy', label: 'Puppy', maxAge: 1, className: 'text-rose-700 bg-rose-100' },
  { value: 'young', label: 'Young', maxAge: 3, className: 'text-emerald-700 bg-emerald-100' },
  { value: 'adult', label: 'Adult', maxAge: 7, className: 'text-blue-700 bg-blue-100' },
  { value: 'senior', label: 'Senior', maxAge: Infinity, className: 'text-violet-700 bg-violet-100' },
];

export function AgeCombobox({ selectedAges, onAgesChange }: AgeComboboxProps) {
  const [query, setQuery] = useState('');

  const filteredCategories = query === ''
    ? ageCategories
    : ageCategories.filter((category) => 
        category.label.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (value: string | null) => {
    if (!value) return;
    if (selectedAges.includes(value)) {
      onAgesChange(selectedAges.filter(age => age !== value));
    } else {
      onAgesChange([...selectedAges, value]);
    }
  };

  const removeAge = (ageToRemove: string) => {
    onAgesChange(selectedAges.filter(age => age !== ageToRemove));
  };

  return (
    <div className="flex flex-col gap-2 w-[200px]">
      <Combobox value={""} onChange={handleSelect} nullable>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg border border-input bg-transparent text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none"
              onChange={(event) => setQuery(event.target.value)}
              displayValue={() => query}
              placeholder={selectedAges.length ? "Add more ages..." : "Filter by age..."}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </Combobox.Button>
          </div>
          <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredCategories.map((category) => (
              <Combobox.Option
                key={category.value}
                value={category.value}
                className={({ active }) =>
                  cn(
                    "relative cursor-default select-none py-2 pl-10 pr-4",
                    active ? "bg-neutral-100 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active }) => (
                  <>
                    <span className="flex items-center gap-2">
                      <Badge className={category.className}>
                        {category.label}
                      </Badge>
                    </span>
                    {selectedAges.includes(category.value) && (
                      <span
                        className={cn(
                          "absolute inset-y-0 left-0 flex items-center pl-3",
                          active ? "text-neutral-950" : "text-neutral-950"
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </div>
      </Combobox>

      {selectedAges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedAges.map((ageValue) => {
            const category = ageCategories.find(cat => cat.value === ageValue);
            if (!category) return null;
            return (
              <Button
                key={ageValue}
                variant="secondary"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => removeAge(ageValue)}
              >
                <Badge className={category.className}>
                  {category.label}
                </Badge>
                <X className="h-3 w-3" />
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}