import { api } from "./api";

export type CalcularJurosInput = {
  valor: number;
  vencimento: string;
};

export const jurosService = {
  calcular: async (data: CalcularJurosInput) => {
    const response = await api.post("/juros/calcular", data);
    return response.data;
  },
};