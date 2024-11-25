export interface Point {
    position: [number, number, number];
    color?: [number, number, number];
    intensity?: number;
    classification?: number;
}

export interface PointCloudChunk {
    points: Point[];
    bounds: {
        min: [number, number, number];
        max: [number, number, number];
    };
    level: number;
}

export interface PointCloudMetadata {
    bounds: {
        min: [number, number, number];
        max: [number, number, number];
    };
    pointCount: number;
    scale?: number;
    offset?: [number, number, number];
}