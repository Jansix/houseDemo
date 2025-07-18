// src/utils/colorUtils.ts

/**
 * 將 HEX 色碼轉換為 HSL 字串 "H S% L%"
 * @param hex - 例如 "#ea580c"
 * @returns - 例如 "22 94% 48%"
 */
export function hexToHsl(hex: string): string | null {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return null

  let c = hex.substring(1).split('')
  if (c.length === 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]]
  }
  const hexVal = '0x' + c.join('')

  let r = ((Number(hexVal) >> 16) & 255) / 255
  let g = ((Number(hexVal) >> 8) & 255) / 255
  let b = (Number(hexVal) & 255) / 255

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2

  if (max !== min) {
    let d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  return `${h} ${s}% ${l}%`
}
