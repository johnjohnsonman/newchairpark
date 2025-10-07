"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  suggestions: string[]
  placeholder?: string
  id?: string
  disabled?: boolean
  allowCustom?: boolean
  className?: string
  onSearch?: (query: string) => void
}

export function AutocompleteInput({
  value,
  onChange,
  suggestions,
  placeholder,
  id,
  disabled,
  allowCustom = true,
  className,
  onSearch
}: AutocompleteInputProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 필터된 제안 목록
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(inputValue.toLowerCase())
  ).slice(0, 10) // 최대 10개만 표시

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // value prop이 변경되면 inputValue 업데이트
  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
    onChange(newValue)
    setOpen(true)
    
    // 외부 검색 콜백
    if (onSearch) {
      onSearch(newValue)
    }
  }

  const handleSelect = (selectedValue: string) => {
    setInputValue(selectedValue)
    onChange(selectedValue)
    setOpen(false)
    inputRef.current?.blur()
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false)
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-8"
        />
        <ChevronDown 
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-transform cursor-pointer",
            open && "rotate-180"
          )}
          onClick={() => {
            setOpen(!open)
            if (!open) {
              inputRef.current?.focus()
            }
          }}
        />
      </div>

      {open && (filteredSuggestions.length > 0 || (allowCustom && inputValue)) && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          <Command>
            <CommandList>
              {filteredSuggestions.length > 0 ? (
                <CommandGroup>
                  {filteredSuggestions.map((suggestion, index) => (
                    <CommandItem
                      key={index}
                      value={suggestion}
                      onSelect={() => handleSelect(suggestion)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === suggestion ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty className="py-6 text-center text-sm">
                  {allowCustom ? (
                    <div>
                      <p className="text-muted-foreground mb-2">제안 없음</p>
                      <p className="text-xs text-muted-foreground">
                        "{inputValue}" 입력 후 Enter
                      </p>
                    </div>
                  ) : (
                    "제안된 항목이 없습니다."
                  )}
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}
