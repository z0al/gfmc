// Token interface
export interface Token {
  type: string
}

// Thematic Break token
export interface ThematicBreak extends Token {
  char: string
}

// ATX Heading token
export interface ATXHeading extends Token {
  level: number
  text: string
}

// Setext Heading Token
export type SetextHeading = ATXHeading
