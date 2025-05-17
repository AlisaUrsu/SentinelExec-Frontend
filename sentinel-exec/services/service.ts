import { AUTH_URL, EXECUTABLES_URL, SCANS_URL, USERS_URL } from "@/endpoints";
import { ConflictError, UnauthorizedError } from "@/errors/http-errors";
import { ChangePasswordDto } from "@/responses/change-password-dto";
import { ExecutableDTO } from "@/responses/executable-dto";
import { ExecutableSummaryDTO } from "@/responses/executable-summary-dto";
import { LoginRequest } from "@/responses/login-request";
import { PaginatedResponse } from "@/responses/paginated-response";
import { PasswordResetDto } from "@/responses/password-reset-dto";
import { RegistrationUserDto } from "@/responses/registration-user-dto";
import { Result } from "@/responses/result";
import { ScanDTO } from "@/responses/scan-dto";
import { UserDto } from "@/responses/user-dto";
import { clearAccessToken, getAccessToken, setAccessToken } from "./auth-token-store";


export async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.message;
    console.log("Error message:", errorMessage);
    if (response.status === 401) {
      throw new UnauthorizedError(errorMessage);
    } else if (response.status === 409) {
      throw new ConflictError(errorMessage);
    } else {
      throw Error(
        "Request failed with status: " +
          response.status +
          " message: " +
          errorMessage
      );
    }
  }
}

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  let token = getAccessToken();

  if (!token) {
    const refreshed = await refreshToken();
    if (!refreshed) {
      throw new Error("Not authenticated and refresh failed");
    }
    token = getAccessToken();
  }

  init = init || {};
  init.headers = {
    ...init.headers,
    Authorization: `Bearer ${token}`,
  };
  init.credentials = "include";
 // to send cookies (refresh token)
  return fetch(input, init);
}

export async function refreshToken(): Promise<boolean> {
  const response = await fetch(`${AUTH_URL}/refresh-token`, {
    method: 'GET',
    credentials: 'include', // Include the HTTP-only cookie
  });

  const result = await response.json();

  if (result.flag && result.data) {
    setAccessToken(result.data); // Store in memory
    return true;
  }

  return false; // Refresh token was invalid or expired
}

interface FetchExecutablesParams {
  pageNumber: number,
  pageSize: number,
  executableName?: string
}

export async function fetchExecutables(params: FetchExecutablesParams): Promise<PaginatedResponse<ExecutableSummaryDTO>> {
    const { pageNumber, pageSize, executableName } = params;

    const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      });


    if (executableName) queryParams.append("executableName", executableName);

    const endpoint = `${EXECUTABLES_URL}?${queryParams.toString()}`;
    const response = await fetchData(endpoint,
        {
            method: "GET"
        });
    const result: Result<PaginatedResponse<ExecutableSummaryDTO>> = await response.json();
    return result.data;

}

interface FetchScansParams {
  pageNumber: number,
  pageSize: number,
  label?: string,
  filename?: string,
  isReported?: boolean,
  user?: string
}

export async function fetchScans(params: FetchScansParams): Promise<PaginatedResponse<ScanDTO>> {
    const { pageNumber, pageSize, label, filename, isReported, user } = params;

    const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      });

    if (label) queryParams.append("label", label);
    if (filename) queryParams.append("filename", filename);
    if (isReported !== undefined) queryParams.append("isReported", isReported.toString());
    if (user) queryParams.append("user", user);

    const endpoint = `${SCANS_URL}?${queryParams.toString()}`;
    const response = await fetchData(endpoint,
        {
            method: "GET"
        });
    const result: Result<PaginatedResponse<ScanDTO>> = await response.json();
    return result.data;

}

export async function fetchExecutableById(id: number): Promise<ExecutableDTO> {
  const response = await fetchData(`${EXECUTABLES_URL}/${id}`,
    {
      method: "GET"
    }
  );
  const result: Result<ExecutableDTO> = await response.json();
  return result.data;
}


export async function register(user: RegistrationUserDto): Promise<void> {
  const response = await fetchData(
    `${AUTH_URL}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );
  const result: Result<null> = await response.json();
  if (result.flag) {
    console.log(result.message); 
  } else {
    console.error("Signup failed:", result.message);
  }
}

export async function enableUser(token: string): Promise<void> {
  const response = await fetchData(
    `${AUTH_URL}/enable/${token}`,
    {
      method: "PUT",
    }
  );

  const result: Result<null> = await response.json();
  if (result.flag) {
    console.log(result.message); 
  } else {
    console.error("Enable user failed:", result.message);
  }
}


export async function login(loginRequest:LoginRequest) {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(loginRequest),
  });
  const result = await response.json();
  if (result.flag && result.data) {
    setAccessToken(result.data);
    return true;
  }
  return false;
}

export async function logout(): Promise<boolean> {
  const response = await fetch(`${AUTH_URL}/logout`, {
    method: "POST",
    credentials: "include",  // include cookies
  });

  const result: Result<void> = await response.json();
  if (result.flag) {
    // Remove access token from localStorage or memory
    //localStorage.removeItem("authToken");
    clearAccessToken();
    console.log("Logged out successfully");
    return true;
  } else {
    console.error("Logout failed");
    return false;
  }
}


export async function requestPasswordReset(email: string): Promise<void> {
  const response = await fetchData(
    `${AUTH_URL}/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: email,
    }
  );

  const result: Result<null> = await response.json();
  if (result.flag) {
    console.log(result.message);
  } else {
    console.error("Reset password request failed:", result.message);
  }
}

export async function resetPassword(dto: PasswordResetDto): Promise<void> {
  const response = await fetchData(
    `${AUTH_URL}/reset-password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    }
  );

  const result: Result<null> = await response.json();
  if (result.flag) {
    console.log(result.message); 
  } else {
    console.error("Password reset failed:", result.message);
  }
}


export async function getRandomPassword(token: string): Promise<String | void> {
  try {
    const response = await fetchData(
      `${AUTH_URL}/reset-password-email/${token}`,
      {
        method: "POST",
      }
    );

    const result: Result<null> = await response.json();
    if (result.flag) {
      console.log(result.message); 
    } else {
      console.error("Failed to send password:", result.message);
    }
  } catch (error) {
    console.error("Error while sending password:", error);
  }
}


export async function getUser(): Promise<UserDto> {
  const response = await fetchWithAuth(`${USERS_URL}`, {
    method: "GET",
  });

  const result: Result<UserDto> = await response.json();
  if (result.flag) {
    return result.data;
  } else {
    throw new Error("Failed to fetch user details: " + result.message);
  }
}


export async function changePassword(
  changePasswordDto: ChangePasswordDto
): Promise<void> {
  const response = await fetchWithAuth(
    `${USERS_URL}/password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changePasswordDto),
    }
  );

  const result: Result<null> = await response.json();
  if (result.flag) {
    console.log(result.message);
  } else {
    throw new Error("Failed to change password: " + result.message);
  }
}

export async function uploadExecutable(file: File): Promise<ScanDTO|undefined> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetchWithAuth(`${SCANS_URL}/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result: Result<ScanDTO> = await response.json();
    console.log("Scan result:", result);
    return result.data;
  } catch (err) {
    console.error("Upload failed:", err);
    return undefined;
  }
}

export async function reportScan(id: number): Promise<ScanDTO> {
  const response = await fetchWithAuth(`${SCANS_URL}/report/${id}`,
    {
      method: "PUT"
    }
  );
  const result: Result<ScanDTO> = await response.json();
  return result.data
}