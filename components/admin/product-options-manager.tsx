"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, GripVertical, Palette, Type, Hash, CheckSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductOption {
  id?: string
  name: string
  type: 'select' | 'color' | 'text' | 'number'
  required: boolean
  values: Array<{
    value: string
    color?: string
    label?: string
  }>
  display_order: number
}

interface ProductOptionsManagerProps {
  productId: string
  initialOptions?: ProductOption[]
  onOptionsChange?: (options: ProductOption[]) => void
}

export function ProductOptionsManager({ 
  productId, 
  initialOptions = [], 
  onOptionsChange 
}: ProductOptionsManagerProps) {
  const [options, setOptions] = useState<ProductOption[]>(initialOptions)
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // 클라이언트에서만 실행
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && onOptionsChange) {
      onOptionsChange(options)
    }
  }, [options, isClient]) // onOptionsChange 제거

  const addOption = () => {
    const newOption: ProductOption = {
      name: '',
      type: 'select',
      required: false,
      values: [],
      display_order: options.length
    }
    setOptions([...options, newOption])
  }

  const updateOption = (index: number, field: keyof ProductOption, value: any) => {
    const updatedOptions = [...options]
    updatedOptions[index] = { ...updatedOptions[index], [field]: value }
    setOptions(updatedOptions)
  }

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const addOptionValue = (optionIndex: number) => {
    const updatedOptions = [...options]
    updatedOptions[optionIndex].values.push({ value: '', label: '' })
    setOptions(updatedOptions)
  }

  const updateOptionValue = (optionIndex: number, valueIndex: number, field: string, value: string) => {
    const updatedOptions = [...options]
    updatedOptions[optionIndex].values[valueIndex] = {
      ...updatedOptions[optionIndex].values[valueIndex],
      [field]: value
    }
    setOptions(updatedOptions)
  }

  const removeOptionValue = (optionIndex: number, valueIndex: number) => {
    const updatedOptions = [...options]
    updatedOptions[optionIndex].values.splice(valueIndex, 1)
    setOptions(updatedOptions)
  }

  const getOptionIcon = (type: string) => {
    switch (type) {
      case 'color': return <Palette className="h-4 w-4" />
      case 'text': return <Type className="h-4 w-4" />
      case 'number': return <Hash className="h-4 w-4" />
      default: return <CheckSquare className="h-4 w-4" />
    }
  }

  const getOptionTypeLabel = (type: string) => {
    switch (type) {
      case 'color': return '색상 선택'
      case 'text': return '텍스트 입력'
      case 'number': return '숫자 입력'
      default: return '선택 옵션'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            제품 옵션
            <Badge variant="secondary">{options.length}개</Badge>
          </CardTitle>
          <Button onClick={addOption} size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            옵션 추가
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {options.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>아직 옵션이 없습니다.</p>
            <p className="text-sm">색상, 사이즈 등을 추가해보세요.</p>
          </div>
        ) : (
          options.map((option, optionIndex) => (
            <Card key={optionIndex} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    {getOptionIcon(option.type)}
                    <Badge variant="outline">{getOptionTypeLabel(option.type)}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(optionIndex)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`option-name-${optionIndex}`}>옵션명</Label>
                    <Input
                      id={`option-name-${optionIndex}`}
                      value={option.name}
                      onChange={(e) => updateOption(optionIndex, 'name', e.target.value)}
                      placeholder="예: 색상, 사이즈"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`option-type-${optionIndex}`}>타입</Label>
                    <Select
                      value={option.type}
                      onValueChange={(value: any) => updateOption(optionIndex, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="select">선택 옵션</SelectItem>
                        <SelectItem value="color">색상 선택</SelectItem>
                        <SelectItem value="text">텍스트 입력</SelectItem>
                        <SelectItem value="number">숫자 입력</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`option-required-${optionIndex}`}
                      checked={option.required}
                      onChange={(e) => updateOption(optionIndex, 'required', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor={`option-required-${optionIndex}`}>필수 선택</Label>
                  </div>
                </div>

                {/* 옵션 값들 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>옵션 값들</Label>
                    <Button
                      onClick={() => addOptionValue(optionIndex)}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      값 추가
                    </Button>
                  </div>

                  {option.values.map((value, valueIndex) => (
                    <div key={valueIndex} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      {option.type === 'color' && (
                        <input
                          type="color"
                          value={value.color || '#000000'}
                          onChange={(e) => updateOptionValue(optionIndex, valueIndex, 'color', e.target.value)}
                          className="w-8 h-8 rounded border"
                        />
                      )}
                      <Input
                        value={value.value}
                        onChange={(e) => updateOptionValue(optionIndex, valueIndex, 'value', e.target.value)}
                        placeholder="옵션 값"
                        className="flex-1"
                      />
                      <Input
                        value={value.label || ''}
                        onChange={(e) => updateOptionValue(optionIndex, valueIndex, 'label', e.target.value)}
                        placeholder="표시명 (선택)"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOptionValue(optionIndex, valueIndex)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {option.values.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      옵션 값이 없습니다. "값 추가" 버튼을 클릭하세요.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  )
}
