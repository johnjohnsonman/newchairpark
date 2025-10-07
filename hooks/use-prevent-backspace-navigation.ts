"use client"

import { useEffect } from "react"

/**
 * 백스페이스 키로 브라우저 뒤로가기를 방지하는 훅
 * 입력 필드가 포커스되어 있을 때만 적용
 */
export function usePreventBackspaceNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 백스페이스 키이고, 현재 포커스된 요소가 입력 필드인 경우
      if (e.key === "Backspace") {
        const activeElement = document.activeElement as HTMLElement
        
        // 입력 필드가 포커스되어 있는지 확인
        const isInputFocused = activeElement && (
          activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.contentEditable === "true" ||
          activeElement.getAttribute("contenteditable") === "true"
        )
        
        // 입력 필드가 포커스되어 있고, 입력값이 비어있거나 커서가 맨 앞에 있을 때
        if (isInputFocused) {
          const input = activeElement as HTMLInputElement | HTMLTextAreaElement
          const cursorPosition = input.selectionStart || 0
          
          // 커서가 맨 앞에 있거나 입력값이 비어있을 때만 방지
          if (cursorPosition === 0 || input.value.length === 0) {
            e.preventDefault()
            e.stopPropagation()
          }
        }
      }
    }

    // 전역 키보드 이벤트 리스너 추가
    document.addEventListener("keydown", handleKeyDown, true)
    
    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true)
    }
  }, [])
}
