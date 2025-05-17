export interface ExecutableDTO {
    id: number,
    name: string,
    label: "Safe" | "Likely Safe" | "Unknown" | "Suspicious" | "Malicious",
    rawFeatures: Record<string, any>,
    score: number,
    firstDetection: string,
    firstReport: string,
    updatedAt: string,
    reporters: Set<string>
}