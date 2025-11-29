import { api } from "./api";
import { Venda } from "../types";

export const vendasService = {
  listar: async (): Promise<Venda[]> => {
    const response = await api.get<Venda[]>("/vendas");
    return response.data;
  },
};