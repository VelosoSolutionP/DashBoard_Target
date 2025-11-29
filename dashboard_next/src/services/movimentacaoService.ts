import { api } from "./api";

export const movimentacaoService = {
  listar: async () => {
    const response = await api.get("/estoque/movimentacoes");
    return response.data;
  },
};