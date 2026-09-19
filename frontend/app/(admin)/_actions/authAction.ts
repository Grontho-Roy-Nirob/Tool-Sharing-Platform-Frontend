import adminApi from "@/lib/adminAxios";

// ==================== LOGIN ====================

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  message: string;
  access_token: string;

  admin: {
    id: number;
    full_name: string;
    email: string;
    role: number;
  };
}

// ==================== LOGIN ACTION ====================

export async function loginAdmin(
  data: AdminLoginData,
): Promise<AdminLoginResponse> {
  const response = await adminApi.post<AdminLoginResponse>(
    "/admin/auth/login",
    data,
  );

  return response.data;
}
