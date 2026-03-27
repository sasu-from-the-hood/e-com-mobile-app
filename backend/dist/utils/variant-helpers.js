// Helper functions for working with product color images
export function getAvailableColors(colorImages) {
    return Object.keys(colorImages);
}
export function getImagesForColor(colorImages, color) {
    return colorImages[color] || [];
}
export function isLowStock(stock, threshold) {
    return stock > 0 && stock <= threshold;
}
//# sourceMappingURL=variant-helpers.js.map