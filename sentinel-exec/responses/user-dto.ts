export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: string;
  profilePicture: string;
  totalScans: number;
  uniqueExecutablesScanned: number;
  totalReports: number;
  createdAt: string;
} 