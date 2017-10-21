<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/yF8xMRYKxBs3t9VeMWabeRrx/ahmed-taj/gfmc'>
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/yF8xMRYKxBs3t9VeMWabeRrx/ahmed-taj/gfmc.svg' />
</a>

# GFM Compiler

JavaScript pure implementation of [GitHub Flavored Markdown](https://github.github.com/gfm) (GFM) specification.

## Why?

- ✅ %100 Specification compliance
- 🚫 No dependencies
- 🚀 Works in Node.js, and Browser

## Usage

```javascript
import gfm from('gfmc')

const markdown = '# This is title  '

console.log(gfm(markdown))
// =>
// <h1>This is title</h1>
```

## Options

TODO

## TODO

The project is still in active development and currently doesn't support:

- Fenced code blocks
- HTML blocks
- Link reference definitions
- Paragraphs
- Blank lines
- Tables 
- Block quotes
- List items
- Task list items 
- Lists
- Backslash escapes
- Entity and numeric character references
- Code spans
- Emphasis and strong emphasis
- Strikethrough 
- Links
- Images
- Autolinks 
- Raw HTML
- Hard line breaks
- Soft line breaks
- Textual content

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars1.githubusercontent.com/u/12673605?v=4" width="100px;"/><br /><sub>Ahmed T. Ali</sub>](https://github.com/ahmed-taj)<br />[📝](#blog-ahmed-taj "Blogposts") [💻](https://github.com/ahmed-taj/gfmc/commits?author=ahmed-taj "Code") [📖](https://github.com/ahmed-taj/gfmc/commits?author=ahmed-taj "Documentation") [⚠️](https://github.com/ahmed-taj/gfmc/commits?author=ahmed-taj "Tests") | [<img src="https://avatars1.githubusercontent.com/u/1915?v=4" width="100px;"/><br /><sub>Ashe Connor</sub>](https://kivikakk.ee)<br />[💬](#question-kivikakk "Answering Questions") |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!

## License

MIT © [Ahmed T. Ali](https://github.com/ahmed-taj)
