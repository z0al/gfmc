// All Tokens have type attribute
export interface Token {
  type: string
}

// Thematic break
export interface ThematicBreak extends Token {
  char: string
}
