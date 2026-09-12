import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ==================== LOGIN ====================

export interface OwnerLoginData {
  email: string;
  password: string;
}

export interface OwnerLoginResponse {
  access_token: string;
}

// ==================== REGISTER ====================

export interface OwnerRegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  nidNumber: string;
  profile_image?: File;
}

export interface OwnerRegisterResponse {
  message?: string;
  access_token?: string;
}

// ==================== LOGIN ACTION ====================

export async function loginOwner(
  data: OwnerLoginData,
): Promise<OwnerLoginResponse> {
  const response = await axios.post<OwnerLoginResponse>(
    `${API_URL}/owner-auth/login`,
    data,
  );

  return response.data;
}

// ==================== REGISTER ACTION ====================

export async function registerOwner(
  data: OwnerRegisterData,
): Promise<OwnerRegisterResponse> {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("phone", data.phone);
  formData.append("nidNumber", data.nidNumber);

  if (data.profile_image) {
    formData.append("myfile", data.profile_image);
  }

  const response = await axios.post<OwnerRegisterResponse>(
    `${API_URL}/owner-auth/register`,
    formData,
  );

  return response.data;
}