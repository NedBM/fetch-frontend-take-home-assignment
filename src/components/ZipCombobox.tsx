'use client'
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ZipCodeComboboxProps {
  selectedZipCodes: string[];
  onZipCodesChange: (zipCodes: string[]) => void;
  showOnlyNearby: boolean;
  onShowOnlyNearbyChange: (show: boolean) => void;
}

export function ZipCodeCombobox({
  selectedZipCodes,
  onZipCodesChange,
  showOnlyNearby,
  onShowOnlyNearbyChange
}: ZipCodeComboboxProps) {
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
    const newZipCodes = selectedZipCodes.filter(zip => zip !== zipToRemove);
    onZipCodesChange(newZipCodes);
    if (newZipCodes.length === 0) {
      onShowOnlyNearbyChange(false);
    }
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' && validateZip(inputValue)) {
              handleAddZip();
            }
          }}
          placeholder="Enter ZIP code..."
          className="w-full rounded-lg border border-input bg-background py-2 pl-3 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-secondary/50 dark:border-secondary"
        />
        {(isFocused || inputValue.length > 0) && (
          <Button 
            onClick={handleAddZip}
            disabled={!validateZip(inputValue) || selectedZipCodes.includes(inputValue)}
            size="sm"
            className="dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
          >
            Add
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
              className="flex items-center gap-1 bg-secondary/50 hover:bg-secondary/70 dark:bg-secondary/30 dark:hover:bg-secondary/50"
              onClick={() => removeZipCode(zip)}
            >
              {zip}
              <X className="h-3 w-3" />
            </Button>
          ))}
          <Button
            variant={showOnlyNearby ? "default" : "outline"}
            size="sm"
            onClick={() => onShowOnlyNearbyChange(!showOnlyNearby)}
            className={`ml-2 ${
              showOnlyNearby 
                ? "dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                : "dark:border-secondary dark:hover:bg-secondary/50"
            }`}
          >
            {showOnlyNearby ? 'Showing Only Nearby' : 'Show Only Nearby'}
          </Button>
        </div>
      )}
    </div>
  );
}