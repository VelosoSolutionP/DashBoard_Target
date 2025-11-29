import { api } from "./api";

export type MovimentacaoInput = {
  produtoId: number;
  quantidade: number;
  descricao: string;
};

export const estoqueService = {
  movimentar: async (data: MovimentacaoInput) => {
    const response = await api.post("/estoque/movimentar", data);
    return response.data;
  },
  listarProdutos: async () => {
    const response = await api.get("/estoque/produtos");
    return response.data;
  },
  listarMovimentacoes: async () => {
    const response = await api.get("/estoque/movimentacoes");
    return response.data;
  },
};