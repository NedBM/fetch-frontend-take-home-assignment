// src/components/StateCombobox.tsx
'use client';

import { Combobox } from '@headlessui/react';
import { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

interface StateComboboxProps {
  selectedStates: string[];
  onStatesChange: (states: string[]) => void;
}

export function StateCombobox({ selectedStates, onStatesChange }: StateComboboxProps) {
  const [query, setQuery] = useState('');

  const filteredStates = query === ''
    ? US_STATES
    : US_STATES.filter((state) => {
        return state.toLowerCase().includes(query.toLowerCase());
      });

  const handleSelect = (state: string) => {
    if (selectedStates.includes(state)) {
      onStatesChange(selectedStates.filter(s => s !== state));
    } else {
      onStatesChange([...selectedStates, state]);
    }
  };

  const removeState = (stateToRemove: string) => {
    onStatesChange(selectedStates.filter(state => state !== stateToRemove));
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
              placeholder={selectedStates.length ? "Add more states..." : "Filter states..."}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </Combobox.Button>
          </div>
          <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredStates.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                No states found.
              </div>
            ) : (
              filteredStates.map((state) => (
                <Combobox.Option
                  key={state}
                  value={state}
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
                        selectedStates.includes(state) && "font-medium"
                      )}>
                        {state}
                      </span>
                      {selectedStates.includes(state) && (
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

      {selectedStates.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedStates.map((state) => (
            <Button
              key={state}
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => removeState(state)}
            >
              {state}
              <X className="h-3 w-3" />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}