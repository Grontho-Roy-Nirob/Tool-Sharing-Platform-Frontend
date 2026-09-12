import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LoginData {
  email: string;
  password: string;
}
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  nidNumber: string;
  profileImage?: File;
}

export interface LoginResponse {
  access_token: string;
}

export interface RegisterResponse {
  message?: string;
  access_token?: string;
}
export async function loginRenter(data: LoginData): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/renter-auth/login`,
    data,
  );
  return response.data;
}


export async function registerRenter(
  data: RegisterData,
): Promise<RegisterResponse> {
  const formData = new FormData();

  formData.append("fullName", data.fullName);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("nidNumber", data.nidNumber);

  if (data.phone) {
    formData.append("phone", data.phone);
  }

  if (data.profileImage) {
    formData.append("profileImage", data.profileImage);
  }

  const response = await axios.post<RegisterResponse>(
    `${API_URL}/renter-auth/register`,
    formData,
  );

  return response.data;
}
