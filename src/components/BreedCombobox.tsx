// src/components/BreedCombobox.tsx
'use client';

import { Combobox } from '@headlessui/react';
import { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BreedComboboxProps {
  breeds: string[];
  selectedBreeds: string[];
  onBreedsChange: (breeds: string[]) => void;
}

export function BreedCombobox({ breeds, selectedBreeds, onBreedsChange }: BreedComboboxProps) {
  const [query, setQuery] = useState('');

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
      <Combobox value={""} onChange={handleSelect} nullable>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg border border-input bg-transparent text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-2">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-1 focus:ring-neutral-950 rounded-md"
              onChange={(event) => setQuery(event.target.value)}
              displayValue={() => query}
              placeholder={selectedBreeds.length ? "Add more breeds..." : "Filter breeds..."}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </Combobox.Button>
          </div>
          <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredBreeds.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
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
                      active ? "bg-blue-600 text-white" : "text-gray-900"
                    )
                  }
                >
                  {({ active }) => (
                    <>
                      <span className={cn(
                        "block truncate",
                        selectedBreeds.includes(breed) && "font-medium"
                      )}>
                        {breed}
                      </span>
                      {selectedBreeds.includes(breed) && (
                        <span
                          className={cn(
                            "absolute inset-y-0 left-0 flex items-center pl-3",
                            active ? "text-white" : "text-blue-600"
                          )}
                        >
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>

      {selectedBreeds.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedBreeds.map((breed) => (
            <Button
              key={breed}
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => removeBreed(breed)}
            >
              {breed}
              <X className="h-3 w-3" />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}