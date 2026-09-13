import api from "@/lib/axios";

export interface CreateOrderPayload {
  tool_ids: number[];
  start_date: string;
  end_date: string;
  message?: string;
}

export interface CreatedOrder {
  id: number;
  renter_id: number;
  start_date: string;
  end_date: string;
  duration_days: number;
  total_amount: number | string;
  status: "pending" | "approved" | "rejected" | "active" | "completed";
  message: string | null;
}

export async function createOrder(
  payload: CreateOrderPayload,
): Promise<CreatedOrder> {
  const response = await api.post<CreatedOrder>("/renter/orders", payload);

  return response.data;
}
