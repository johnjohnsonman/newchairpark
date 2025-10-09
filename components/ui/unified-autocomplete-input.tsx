"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useUnifiedBrandProduct } from "@/hooks/use-unified-brand-product"

// 로딩 컴포넌트
function AutocompleteLoading() {
  return (
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
    </div>
  )
}

interface UnifiedAutocompleteInputProps {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type: "brand" | "product"
  selectedBrand?: string // product 타입일 때 필요한 브랜드 정보
  className?: string
  disabled?: boolean
}

// 내부 컴포넌트
function UnifiedAutocompleteInputInner({
  label,
  placeholder,
  value,
  onChange,
  type,
  selectedBrand,
  className,
  disabled = false
}: UnifiedAutocompleteInputProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [isMounted, setIsMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // 컴포넌트 마운트 상태 관리
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { 
    brands, 
    products, 
    isLoading, 
    error, 
    getProductsByBrand, 
    searchBrands, 
    searchProducts 
  } = useUnifiedBrandProduct()

  // 입력값이 변경될 때마다 상위 컴포넌트에 전달
  useEffect(() => {
    if (inputValue !== value) {
      onChange(inputValue)
    }
  }, [inputValue, value]) // onChange를 의존성에서 제거하여 무한 루프 방지

  // 외부에서 value가 변경될 때 inputValue 동기화
  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleSelect = useCallback((selectedValue: string) => {
    setInputValue(selectedValue)
    setOpen(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setOpen(true)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false)
    }
  }, [])

  const getSuggestions = useCallback(() => {
    if (type === "brand") {
      return searchBrands(inputValue)
    } else {
      return searchProducts(inputValue, selectedBrand)
    }
  }, [type, inputValue, selectedBrand, searchBrands, searchProducts])

  const suggestions = getSuggestions()
  const hasSuggestions = suggestions.length > 0
  const showSuggestions = open && (inputValue.length > 0 || hasSuggestions)

  if (isLoading) {
    return (
      <div className={cn("space-y-2", className)}>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
        <div className="h-10 bg-gray-100 rounded-md animate-pulse"></div>
        <p className="text-xs text-gray-500">데이터 로딩 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("space-y-2", className)}>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
        <div className="h-10 border border-red-200 rounded-md flex items-center px-3">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="flex-1 bg-transparent outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <p className="text-xs text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      
      <Popover open={showSuggestions} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10",
                className
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setOpen(!open)}
              disabled={disabled}
            >
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </Button>
          </div>
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandList>
              {suggestions.length === 0 && inputValue.length > 0 ? (
                <CommandEmpty>
                  {type === "brand" ? "새 브랜드를 입력하세요" : "새 제품명을 입력하세요"}
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {suggestions.map((suggestion) => (
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
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      <p className="text-xs text-muted-foreground">
        {type === "brand" 
          ? "기존 브랜드 선택 또는 새 브랜드 입력 가능" 
          : selectedBrand 
            ? `"${selectedBrand}" 브랜드의 기존 제품 선택 또는 새 제품 입력`
            : "기존 제품명 선택 또는 새 제품명 입력 가능"
        }
        {hasSuggestions && ` (${suggestions.length}개 제안)`}
      </p>
    </div>
  )
}

// 메인 export 함수
export function UnifiedAutocompleteInput(props: UnifiedAutocompleteInputProps) {
  return <UnifiedAutocompleteInputInner {...props} />
}
