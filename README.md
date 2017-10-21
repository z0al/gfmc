<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/yF8xMRYKxBs3t9VeMWabeRrx/ahmed-taj/gfmc'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/yF8xMRYKxBs3t9VeMWabeRrx/ahmed-taj/gfmc.svg' />
</a>

# GFM Compiler

Specification compliance [GitHub Flavored Markdown](https://github.github.com/gfm) (GFM) compiler

## Usage

```javascript
import gfmc from('gfmc')

const markdown = '# This is title  '

console.log(gfmc(markdown))
// =>
// <h1>This is title</h1>
```

## Progress

The project is still in active development and currently supports:

- [x] Thematic breaks
- [x] ATX headings
- [x] Setext headings
- [ ] Indented code blocks
- [ ] Fenced code blocks
- [ ] HTML blocks
- [ ] Link reference definitions
- [ ] Paragraphs
- [ ] Blank lines
- [ ] Tables (extension)
- [ ] Block quotes
- [ ] List items
- [ ] Task list items (extension)
- [ ] Lists
- [ ] Backslash escapes
- [ ] Entity and numeric character references
- [ ] Code spans
- [ ] Emphasis and strong emphasis
- [ ] Strikethrough (extension)
- [ ] Links
- [ ] Images
- [ ] Autolinks
- [ ] Autolinks (extension)
- [ ] Raw HTML
- [ ] Disallowed Raw HTML (extension)
- [ ] Hard line breaks
- [ ] Soft line breaks
- [ ] Textual content

## License

MIT © [Ahmed T. Ali](https://github.com/ahmed-taj)
