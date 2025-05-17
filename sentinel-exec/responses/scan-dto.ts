import { ScanExecutableDTO } from "./scan-executable-dto";

export interface ScanDTO {
    id: number,
    userId: number,
    executableDTO: ScanExecutableDTO,
    score: number,
    label: "Safe" | "Likely Safe" | "Unknown" | "Suspicious" | "Malicious",
    reported: boolean,
    content: string,
    createdAt: string
}