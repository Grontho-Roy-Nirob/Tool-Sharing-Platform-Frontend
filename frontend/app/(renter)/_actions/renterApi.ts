import api from "@/lib/axios";


export async function getMyOrders() {
  const response = await api.get("/renter/orders");

  return response.data;
}