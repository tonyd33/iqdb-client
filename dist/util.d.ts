export declare function parseSimilarity(txt: string): number | null;
export declare function parseSizeAndType(txt: string): string | {
    size: {
        width: number;
        height: number;
    };
    type: string;
};
export declare function randomFileName(): string;
