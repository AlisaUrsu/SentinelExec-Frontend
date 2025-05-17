export interface ExecutableSummaryDTO {
    id: number,
    name: string,
    label: "Safe" | "Likely Safe" | "Unknown" | "Suspicious" | "Malicious",
    sha256: string,
    fileSize: number,
    score: number,
    firstDetection: string,
    firstReport: string,
    reporters: number
}