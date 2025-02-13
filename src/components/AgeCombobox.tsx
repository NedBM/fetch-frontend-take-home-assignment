'use client';

import { Combobox } from '@headlessui/react';
import { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface AgeComboboxProps {
  selectedAges: string[];
  onAgesChange: (ages: string[]) => void;
}

const ageCategories = [
  { value: '0-1', label: 'Puppy (0-1)', ages: ['0', '1'], className: 'text-rose-700 bg-rose-100' },
  { value: '2-3', label: 'Young (2-3)', ages: ['2', '3'], className: 'text-emerald-700 bg-emerald-100' },
  { value: '4-7', label: 'Adult (4-7)', ages: ['4', '5', '6', '7'], className: 'text-blue-700 bg-blue-100' },
  { value: '8+', label: 'Senior (8+)', ages: ['8', '9', '10', '11', '12', '13', '14', '15'], className: 'text-violet-700 bg-violet-100' }
];

export function AgeCombobox({ selectedAges, onAgesChange }: AgeComboboxProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCategories = query === ''
    ? ageCategories
    : ageCategories.filter((category) => 
        category.label.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (value: string) => {
    const category = ageCategories.find(cat => cat.value === value);
    if (!category) return;

    const hasAllAges = category.ages.every(age => selectedAges.includes(age));
    if (hasAllAges) {
      onAgesChange(selectedAges.filter(age => !category.ages.includes(age)));
    } else {
      const newAges = [...new Set([...selectedAges, ...category.ages])];
      onAgesChange(newAges);
    }
  };

  const removeCategory = (categoryToRemove: typeof ageCategories[0]) => {
    onAgesChange(selectedAges.filter(age => !categoryToRemove.ages.includes(age)));
  };

  const getSelectedCategories = () => 
    ageCategories.filter(category => 
      category.ages.some(age => selectedAges.includes(age))
    );

  return (
    <div className="flex flex-col gap-2 w-[200px]">
      <Combobox 
        value="" 
        onChange={handleSelect}
        as={motion.div}
        layout
      >
        <div className="relative">
          <motion.div 
            className="relative w-full cursor-default overflow-hidden rounded-lg border border-input bg-transparent text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-2"
            whileTap={{ scale: 0.995 }}
          >
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-1 focus:ring-neutral-950 rounded-md"
              onChange={(event) => setQuery(event.target.value)}
              displayValue={() => query}
              placeholder={selectedAges.length ? "Add more ages..." : "Filter by age..."}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setIsOpen(false)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </motion.div>
            </Combobox.Button>
          </motion.div>
          <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredCategories.map((category) => (
              <Combobox.Option
                key={category.value}
                value={category.value}
                className={({ active }) =>
                  cn(
                    "relative cursor-default select-none py-2 pl-10 pr-4",
                    active ? "bg-blue-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active }) => (
                  <motion.div layout>
                    <span className={cn(
                      "block truncate",
                      category.ages.some(age => selectedAges.includes(age)) && "font-medium"
                    )}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge className={category.className}>
                          {category.label}
                        </Badge>
                      </motion.div>
                    </span>
                    <AnimatePresence>
                      {category.ages.some(age => selectedAges.includes(age)) && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className={cn(
                            "absolute inset-y-0 left-0 flex items-center pl-3",
                            active ? "text-white" : "text-blue-600"
                          )}
                        >
                          <Check className="h-4 w-4" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </div>
      </Combobox>

      <AnimatePresence>
        {selectedAges.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap gap-2 mt-2"
          >
            <AnimatePresence>
              {getSelectedCategories().map((category) => (
                <motion.div
                  key={category.value}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-1 group"
                    onClick={() => removeCategory(category)}
                  >
                    <Badge className={category.className}>
                      {category.label}
                    </Badge>
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-3 w-3" />
                    </motion.div>
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}