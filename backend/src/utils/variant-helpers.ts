// Helper functions for working with product color images

export function getAvailableColors(colorImages: Record<string, string[]>): string[] {
  return Object.keys(colorImages);
}

export function getImagesForColor(
  colorImages: Record<string, string[]>,
  color: string
): string[] {
  return colorImages[color] || [];
}

export function isLowStock(stock: number, threshold: number): boolean {
  return stock > 0 && stock <= threshold;
}
