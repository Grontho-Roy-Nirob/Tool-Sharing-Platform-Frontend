import axios from "axios";

const toolApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export interface PublicTool {
  id: number;
  tool_name: string;
  description: string;
  brand: string;
  condition: string;
  rental_price_per_day: number;
  location: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  status: "pending" | "approved" | "rejected";
  tool_image: string;
  category_id: number;

  category?: {
    id: number;
    name: string;
  };

  owner?: {
    id: number;
    name: string;
    email: string;
  };
}

export async function getPublicTools(): Promise<PublicTool[]> {
  const response = await toolApi.get<PublicTool[]>("/tools");
  return response.data;
}

export async function getPublicToolById(id: number): Promise<PublicTool> {
  const response = await toolApi.get<PublicTool>(`/tools/${id}`);
  return response.data;
}

export default toolApi;
