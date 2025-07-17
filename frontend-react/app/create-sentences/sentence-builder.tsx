"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface WordInputChipProps {
  word: string
  onWordChange: (value: string) => void
  onRemove: () => void
  mockWords: string[]
  isLastEmpty: boolean
}

function WordInputChip({ word, onWordChange, onRemove, mockWords, isLastEmpty }: WordInputChipProps) {
  const [isEditing, setIsEditing] = useState(word === "")
  const [localSearchTerm, setLocalSearchTerm] = useState(word)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  useEffect(() => {
    setLocalSearchTerm(word)
    if (word === "") {
      setIsEditing(true)
    } else {
      setIsEditing(false)
    }
  }, [word])

  const filteredLocalWords = localSearchTerm
    ? mockWords.filter((w) => w.toLowerCase().includes(localSearchTerm.toLowerCase()))
    : []

  const handleSelectSuggestion = (selectedWord: string) => {
    onWordChange(selectedWord)
    setIsEditing(false)
  }

  const handleInputBlur = () => {
    // If the input is empty and it's not the last empty slot, allow it to become a badge
    // Otherwise, keep it in editing mode if it's the last empty slot
    if (localSearchTerm === "" && !isLastEmpty) {
      setIsEditing(false)
    } else if (localSearchTerm !== "") {
      setIsEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && localSearchTerm.trim() !== "") {
      onWordChange(localSearchTerm.trim())
      setIsEditing(false)
    }
  }

  return (
    <div className="relative">
      {isEditing ? (
        <div className="flex items-center gap-1">
          <Input
            ref={inputRef}
            type="text"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            onBlur={handleInputBlur}
            onFocus={() => setIsEditing(true)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập từ..."
            className="w-32 rounded-xl border-blue-400 focus-visible:ring-blue-300"
          />
          {localSearchTerm && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setLocalSearchTerm("")
                onWordChange("")
                inputRef.current?.focus()
              }}
              className="rounded-full w-6 h-6 text-gray-500 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          {filteredLocalWords.length > 0 && localSearchTerm && (
            <Card className="absolute top-full left-0 mt-1 w-full bg-white shadow-lg rounded-lg z-10 max-h-40 overflow-y-auto">
              {filteredLocalWords.map((sugg, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-sm hover:bg-blue-50"
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
                  onClick={() => handleSelectSuggestion(sugg)}
                >
                  {sugg}
                </Button>
              ))}
            </Card>
          )}
        </div>
      ) : (
        <Badge
          variant="outline"
          className="relative bg-white text-blue-600 border-blue-400 px-4 py-2 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors"
          onClick={() => setIsEditing(true)}
        >
          {word}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation() // Prevent badge click from re-editing
              onRemove()
            }}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      )}
    </div>
  )
}
