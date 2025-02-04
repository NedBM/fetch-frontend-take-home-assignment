'use client'
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ZipCodeComboboxProps {
  selectedZipCodes: string[];
  onZipCodesChange: (zipCodes: string[]) => void;
}

export function ZipCodeCombobox({ selectedZipCodes, onZipCodesChange }: ZipCodeComboboxProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const validateZip = (zip: string) => /^\d{5}$/.test(zip);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 5);
    setInputValue(value);
  };

  const handleAddZip = () => {
    if (validateZip(inputValue) && !selectedZipCodes.includes(inputValue)) {
      onZipCodesChange([...selectedZipCodes, inputValue]);
      setInputValue('');
    }
  };

  const removeZipCode = (zipToRemove: string) => {
    onZipCodesChange(selectedZipCodes.filter(zip => zip !== zipToRemove));
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-[350px]">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Filter by ZIP code..."
          className="w-full rounded-lg border border-input bg-white py-2 pl-3 pr-3 text-sm shadow-sm"
        />
        {(isFocused || inputValue.length > 0) && (
          <Button 
            onClick={handleAddZip}
            disabled={!validateZip(inputValue) || selectedZipCodes.includes(inputValue)}
            size="sm"
          >
            Add Filter
          </Button>
        )}
      </div>

      {selectedZipCodes.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedZipCodes.map((zip) => (
            <Button
              key={zip}
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => removeZipCode(zip)}
            >
              {zip}
              <X className="h-3 w-3" />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}