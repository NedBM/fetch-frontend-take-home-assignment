'use client';

import { Combobox } from '@headlessui/react';
import { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface BreedComboboxProps {
  breeds: string[];
  selectedBreeds: string[];
  onBreedsChange: (breeds: string[]) => void;
}

export function BreedCombobox({ breeds, selectedBreeds, onBreedsChange }: BreedComboboxProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredBreeds = query === ''
    ? breeds
    : breeds.filter((breed) => {
        return breed.toLowerCase().includes(query.toLowerCase());
      });

  const handleSelect = (breed: string) => {
    if (selectedBreeds.includes(breed)) {
      onBreedsChange(selectedBreeds.filter(b => b !== breed));
    } else {
      onBreedsChange([...selectedBreeds, breed]);
    }
  };

  const removeBreed = (breedToRemove: string) => {
    onBreedsChange(selectedBreeds.filter(breed => breed !== breedToRemove));
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-[350px]">
      <Combobox 
        value={""} 
        onChange={handleSelect} 
        nullable
        as={motion.div}
        layout
      >
        <div className="relative">
          <motion.div 
            className="relative w-full cursor-default overflow-hidden rounded-lg border border-input bg-background dark:bg-gray-800 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-2"
            whileTap={{ scale: 0.995 }}
          >
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-neutral-950 dark:focus:ring-neutral-200 rounded-md bg-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400"
              onChange={(event) => setQuery(event.target.value)}
              displayValue={() => query}
              placeholder={selectedBreeds.length ? "Add more breeds..." : "Filter breeds..."}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setIsOpen(false)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronsUpDown className="h-4 w-4 opacity-50 dark:text-gray-400" />
              </motion.div>
            </Combobox.Button>
          </motion.div>
          <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredBreeds.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                No breeds found.
              </div>
            ) : (
              filteredBreeds.map((breed) => (
                <Combobox.Option
                  key={breed}
                  value={breed}
                  className={({ active }) =>
                    cn(
                      "relative cursor-default select-none py-2 pl-10 pr-4",
                      active ? "bg-blue-600 text-white" : "text-gray-900 dark:text-gray-100"
                    )
                  }
                >
                  {({ active }) => (
                    <motion.div layout>
                      <span className={cn(
                        "block truncate",
                        selectedBreeds.includes(breed) && "font-medium"
                      )}>
                        {breed}
                      </span>
                      <AnimatePresence>
                        {selectedBreeds.includes(breed) && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className={cn(
                              "absolute inset-y-0 left-0 flex items-center pl-3",
                              active ? "text-white" : "text-blue-600 dark:text-blue-400"
                            )}
                          >
                            <Check className="h-4 w-4" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>

      <AnimatePresence>
        {selectedBreeds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2 mt-2"
          >
            <AnimatePresence>
              {selectedBreeds.map((breed) => (
                <motion.div
                  key={breed}
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
                    className="flex items-center gap-1 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
                    onClick={() => removeBreed(breed)}
                  >
                    <span>{breed}</span>
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