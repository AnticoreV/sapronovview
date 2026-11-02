/** Minimal types for the parts of opentype.js used by src/lib/brand-images.ts. */
declare module "opentype.js" {
  export interface Path {
    toPathData(decimalPlaces?: number): string;
  }
  export interface Font {
    unitsPerEm: number;
    charToGlyphIndex(char: string): number;
    getAdvanceWidth(
      text: string,
      fontSize: number,
      options?: { letterSpacing?: number; kerning?: boolean },
    ): number;
    getPath(
      text: string,
      x: number,
      y: number,
      fontSize: number,
      options?: { letterSpacing?: number; kerning?: boolean },
    ): Path;
  }
  export function parse(buffer: ArrayBuffer): Font;
  const opentype: { parse: typeof parse };
  export default opentype;
}
