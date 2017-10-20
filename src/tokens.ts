// Token interface
export interface Token {
  type: string
}

// Thematic Break token
export interface ThematicBreak extends Token {
  char: string
}

// Heading token
export interface Heading extends Token {
  text: string
  level: number
  atx: boolean
}
