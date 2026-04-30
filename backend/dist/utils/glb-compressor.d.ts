export interface CompressionResult {
    compressedPath: string;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
}
export declare function compressGLB(inputBuffer: Buffer, outputPath: string): Promise<CompressionResult>;
//# sourceMappingURL=glb-compressor.d.ts.map