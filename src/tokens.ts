// Token interface
export interface Token {
  type: string
}

// Thematic Break token
export interface ThematicBreak extends Token {
  char: string
}
