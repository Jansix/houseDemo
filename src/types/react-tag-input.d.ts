declare module 'react-tag-input' {
  export interface Tag {
    id: string
    text: string
  }

  export interface TagInputProps {
    tags: Tag[]
    suggestions?: string[]
    handleDelete: (index: number) => void
    handleAddition: (tag: Tag) => void
    handleDrag?: (tag: Tag, currPos: number, newPos: number) => void
    handleTagClick?: (index: number) => void
    placeholder?: string
    autofocus?: boolean
    allowDeleteFromEmptyInput?: boolean
    allowAdditionFromPaste?: boolean
    allowDragDrop?: boolean
    autocomplete?: boolean
    readOnly?: boolean
    maxLength?: number
    classNames?: {
      tags?: string
      tagInput?: string
      tagInputField?: string
      selected?: string
      tag?: string
      remove?: string
      suggestions?: string
      activeSuggestion?: string
    }
    renderSuggestion?: (suggestion: string, query: string) => JSX.Element
    inputFieldPosition?: 'top' | 'bottom' | 'inline'
    editable?: boolean
    clearAll?: boolean
    handleClearAll?: () => void
    minQueryLength?: number
    removeWithoutConfirmation?: boolean
    onTagUpdate?: (index: number, tag: Tag) => void
    allowUnique?: boolean
  }

  export function WithContext(
    TagInput: React.ComponentType<TagInputProps>
  ): React.ComponentType<TagInputProps>
  export default function TagInput(props: TagInputProps): JSX.Element
}
