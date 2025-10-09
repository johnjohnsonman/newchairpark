"use client"

import { useState, useRef, useEffect, useCallback, memo } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface SafeAutocompleteInputProps {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  suggestions: string[]
  isLoading?: boolean
  error?: string | null
  className?: string
  disabled?: boolean
}

const SafeAutocompleteInput = memo(function SafeAutocompleteInput({
  label,
  placeholder,
  value,
  onChange,
  suggestions,
  isLoading = false,
  error = null,
  className,
  disabled = false
}: SafeAutocompleteInputProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  // 외부에서 value가 변경될 때 inputValue 동기화
  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleSelect = useCallback((selectedValue: string) => {
    setInputValue(selectedValue)
    setOpen(false)
    onChange(selectedValue)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [onChange])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setOpen(true)
    onChange(newValue)
  }, [onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false)
    }
  }, [])

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <div className={cn("grid gap-2", className)}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            <input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto flex-1 text-left"
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
            />
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput
              placeholder={placeholder}
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? "로딩 중..." : error ? error : "결과가 없습니다."}
              </CommandEmpty>
              <CommandGroup>
                {filteredSuggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion}
                    value={suggestion}
                    onSelect={() => handleSelect(suggestion)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        inputValue === suggestion ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {suggestion}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      <p className="text-xs text-muted-foreground">
        기존 항목 선택 또는 새 항목 입력 가능 ({filteredSuggestions.length}개 제안)
      </p>
    </div>
  )
})

export { SafeAutocompleteInput }
