"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Card from "@/components/Card";
import { FaClock, FaCoins, FaMoneyBillWave } from "react-icons/fa";
import { api } from "@/services/api";

interface ResultadoJuros {
  diasAtraso: number;
  juros: number;
  valorFinal: number;
}

export default function JurosPage() {
  const [valor, setValor] = useState<string>("");
  const [vencimento, setVencimento] = useState<string>("");
  const [resultado, setResultado] = useState<ResultadoJuros | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatarMoeda = (value: string) => {
    const numeros = value.replace(/\D/g, "");
    return (Number(numeros) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValor(formatarMoeda(e.target.value));
  };

  const handleCalcular = async () => {
    setError(null);
    setResultado(null);

    if (!valor || !vencimento) {
      setError("Preencha todos os campos.");
      return;
    }

    const valorNumero = Number(valor.replace(/\D/g, "")) / 100;
    const dataVencimento = new Date(vencimento);
    const hoje = new Date();
    if (dataVencimento > hoje) {
      setError("A data de vencimento não pode ser futura.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<ResultadoJuros>("/juros/calcular", {
        valor: valorNumero,
        vencimento,
      });
      setResultado(res.data);
    } catch (err) {
      console.error(err);
      setError("Erro ao calcular juros.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-indigo-600 tracking-wide">
          Calculadora de Juros
        </h1>

        <div className="bg-white p-8 rounded-3xl shadow-2xl mb-8 w-full max-w-md flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-800">Valor</label>
            <input
              type="text"
              placeholder="R$ 0,00"
              className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-medium text-gray-900 placeholder-gray-400"
              value={valor}
              onChange={handleValorChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-800">Data de Vencimento</label>
            <input
              type="date"
              className="p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg font-medium text-gray-900 placeholder-gray-400"
              value={vencimento}
              onChange={(e) => setVencimento(e.target.value)}
              max={new Date().toISOString().split("T")[0]} // só permite datas <= hoje
            />
          </div>

          <button
            onClick={handleCalcular}
            disabled={loading}
            className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all font-semibold text-lg"
          >
            {loading ? "Calculando..." : "Calcular"}
          </button>

          {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
        </div>

        {resultado && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center w-full max-w-4xl">
            <Card
              title="Dias de Atraso"
              value={`${resultado.diasAtraso}`}
              icon={<FaClock className="text-yellow-500" />}
              className="bg-gradient-to-r from-yellow-100 to-yellow-300 shadow-lg"
            />
            <Card
              title="Juros"
              value={`R$ ${resultado.juros.toFixed(2)}`}
              icon={<FaCoins className="text-indigo-500" />} // ícone atualizado
              className="bg-gradient-to-r from-indigo-100 to-indigo-300 shadow-lg"
            />
            <Card
              title="Valor Final"
              value={`R$ ${resultado.valorFinal.toFixed(2)}`}
              icon={<FaMoneyBillWave className="text-green-500" />}
              className="bg-gradient-to-r from-green-100 to-green-300 shadow-lg"
            />
          </div>
        )}
      </main>
    </div>
  );
}