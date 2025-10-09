"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useUnifiedBrandProduct } from "@/hooks/use-unified-brand-product"

// 로딩 컴포넌트
function AutocompleteLoading({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="h-10 bg-gray-100 rounded-md animate-pulse"></div>
      <p className="text-xs text-gray-500">데이터 로딩 중...</p>
    </div>
  )
}

interface BrandProductAutocompleteProps {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type: "brand" | "product"
  selectedBrand?: string
  className?: string
  disabled?: boolean
}

function BrandProductAutocompleteInner({
  label,
  placeholder,
  value,
  onChange,
  type,
  selectedBrand,
  className,
  disabled = false
}: BrandProductAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const [isClient, setIsClient] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 클라이언트 마운트 확인
  useEffect(() => {
    setIsClient(true)
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

  // 입력값 변경 처리
  useEffect(() => {
    if (inputValue !== value) {
      onChange(inputValue)
    }
  }, [inputValue, value])

  // 외부 value 변경 동기화
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // 입력값 변경 핸들러
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue)
  }

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  // 선택 핸들러
  const handleSelect = (selectedValue: string) => {
    setInputValue(selectedValue)
    setOpen(false)
  }

  // 서버 사이드 렌더링 중에는 기본 input만 표시
  if (!isClient) {
    return (
      <div className={cn("space-y-2", className)}>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        />
      </div>
    )
  }

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
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="flex-1 bg-transparent outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <p className="text-xs text-red-500">{error}</p>
      </div>
    )
  }

  // 제안 목록 생성
  let suggestions: string[] = []
  if (type === "brand") {
    suggestions = searchBrands(inputValue)
  } else if (type === "product") {
    suggestions = selectedBrand 
      ? searchProducts(inputValue, selectedBrand)
      : searchProducts(inputValue)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
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
                  {suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => (
                      <CommandItem
                        key={`${suggestion}-${index}-${type}`}
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
                    ))
                  ) : (
                    <CommandEmpty>
                      {type === "brand" ? "브랜드를 검색하세요" : "제품을 검색하세요"}
                    </CommandEmpty>
                  )}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {type === "product" && selectedBrand && (
        <p className="text-xs text-muted-foreground">
          {selectedBrand} 브랜드의 제품만 표시됩니다
        </p>
      )}
    </div>
  )
}

export function BrandProductAutocomplete(props: BrandProductAutocompleteProps) {
  return (
    <Suspense fallback={<AutocompleteLoading className={props.className} />}>
      <BrandProductAutocompleteInner {...props} />
    </Suspense>
  )
}
