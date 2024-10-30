export function parse(str: string) {
  try {
    return JSON.parse(str)
  } catch (e) {
    return fixParse(str)
  }
}

function fixParse(str: string) {
  str = str.replace('\n ', '').replace(/\s/g, '')
  let oldStr = str
  const waitSupSymbols: string[] = []
  while (str) {
    const char = str.substring(0, 1)
    const lastWaitSymbol = waitSupSymbols[waitSupSymbols.length - 1]
    let index = -1
    switch (char) {
      case `[`:
      case `{`:
        waitSupSymbols.push(char)
        break
      case `"`:
      case `'`:
        if (lastWaitSymbol === char) {
          waitSupSymbols.pop()
        } else {
          waitSupSymbols.push(char)
        }
        break
      case `:`:
        index = waitSupSymbols.lastIndexOf(',')
        waitSupSymbols.push(char)
        break
      case `,`:
        waitSupSymbols.push(',')
        break
      case `]`:
        index = waitSupSymbols.lastIndexOf('[')
        break
      case `}`:
        index = waitSupSymbols.lastIndexOf('{')
        break
      default:
        if (char !== ' ') {
          index = waitSupSymbols.lastIndexOf(':')
        }
        break
    }
    if (index !== -1) {
      waitSupSymbols.splice(index, 1)
    }
    str = str.substring(1, str.length)
  }
  const fixSymbolsMap = { '[': ']', '{': '}', '"': '', "'": `'`, ',': '', ':': '""' }
  waitSupSymbols.reverse().forEach((symbol, index) => {
    oldStr += fixSymbolsMap[symbol]
    if (symbol === ',' && waitSupSymbols[index - 1] === '"') {
      oldStr += `:""`
    }
  })
  oldStr = oldStr
    .replace(/undefined/g, '')
    .replace(/,}/g, '}')
    .replace(/,"":""/g, '')
  try {
    return JSON.parse(oldStr)
  } catch (e) {
    //
  }
}
