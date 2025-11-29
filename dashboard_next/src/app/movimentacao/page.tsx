"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Card from "@/components/Card";
import { FaArrowUp, FaArrowDown, FaBoxes, FaPlus, FaMinus } from "react-icons/fa";
import { api } from "@/services/api";
import type { Produto, Movimentacao } from "@/types";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function MovimentacaoPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [filtro, setFiltro] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduto, setModalProduto] = useState<Produto | null>(null);
  const [modalTipo, setModalTipo] = useState<"entrada" | "saida">("entrada");
  const [modalQuantidade, setModalQuantidade] = useState("");
  const [modalDescricao, setModalDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega produtos e movimentações
  const carregarDados = async () => {
    try {
      const [prodRes, movRes] = await Promise.all([
        api.get<Produto[]>("/estoque/produtos"),
        api.get<Movimentacao[]>("/estoque/movimentacoes"),
      ]);

      // Ordena por data crescente
      const movimentacoesOrdenadas = movRes.data.sort(
        (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
      );

      setProdutos(prodRes.data);
      setMovimentacoes(movimentacoesOrdenadas);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados.");
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const openModal = (produto: Produto, tipo: "entrada" | "saida") => {
    setModalProduto(produto);
    setModalTipo(tipo);
    setModalQuantidade("");
    setModalDescricao("");
    setModalOpen(true);
    setError(null);
  };

  const handleQuantidadeChange = (value: string) => {
    const clean = value.replace(/[^0-9]/g, "");
    setModalQuantidade(modalTipo === "saida" ? (clean ? "-" + clean : "") : clean);
  };

  // Função para movimentação
  const handleMovimentar = async () => {
    if (!modalProduto || !modalQuantidade || !modalDescricao) {
      setError("Preencha todos os campos do formulário corretamente.");
      return;
    }

    let quantidadeNum = Number(modalQuantidade);
    if (modalTipo === "entrada") quantidadeNum = Math.abs(quantidadeNum);
    if (modalTipo === "saida") quantidadeNum = -Math.abs(quantidadeNum);

    setLoading(true);
    setError(null);

    try {
      // Buscar última movimentação do produto
      const ultimoMovRes = await api.get<Movimentacao[]>(
        `/estoque/movimentacoes/ultimo/${modalProduto.id}`
      );
      const ultimoMov = ultimoMovRes.data[0];

      const estoqueAnterior = ultimoMov ? ultimoMov.estoqueAtual : modalProduto.estoque;
      const estoqueAtual = estoqueAnterior + quantidadeNum;

      // Postar movimentação com estoqueAnterior e estoqueAtual
      await api.post("/estoque/movimentar", {
        produtoId: modalProduto.id,
        quantidade: quantidadeNum,
        descricao: modalDescricao,
        estoqueAnterior,
        estoqueAtual,
      });

      // Atualiza estoque local
      setProdutos((prev) =>
        prev.map((p) =>
          p.id === modalProduto.id
            ? { ...p, estoque: estoqueAtual }
            : p
        )
      );

      await carregarDados();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setError("Erro ao registrar movimentação.");
    } finally {
      setLoading(false);
    }
  };

  const produtosFiltrados = produtos.filter((p) =>
    p.descricaoProduto.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalEntradas = movimentacoes
    .filter((m) => m.quantidade > 0)
    .reduce((acc, m) => acc + m.quantidade, 0);

  const totalSaidas = movimentacoes
    .filter((m) => m.quantidade < 0)
    .reduce((acc, m) => acc + Math.abs(m.quantidade), 0);

  const estoqueFinalTotal = produtos.reduce((acc, p) => acc + p.estoque, 0);

  // Export Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      movimentacoes.map((m) => {
        const produto = produtos.find((p) => p.id === m.produtoId);
        return {
          Produto: produto?.descricaoProduto || "",
          Descrição: m.descricao,
          Quantidade: m.quantidade,
          Tipo: m.quantidade > 0 ? "Entrada" : "Saída",
          "Estoque Anterior": m.estoqueAnterior,
          "Estoque Atual": m.estoqueAtual,
          Data: new Date(m.data).toLocaleDateString(),
        };
      })
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Movimentações");
    XLSX.writeFile(wb, "movimentacoes.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Movimentações de Estoque", 14, 15);
    (doc as any).autoTable({
      startY: 20,
      head: [["Produto", "Descrição", "Quantidade", "Tipo", "Estoque Anterior", "Estoque Atual", "Data"]],
      body: movimentacoes.map((m) => {
        const produto = produtos.find((p) => p.id === m.produtoId);
        return [
          produto?.descricaoProduto || "",
          m.descricao,
          m.quantidade,
          m.quantidade > 0 ? "Entrada" : "Saída",
          m.estoqueAnterior,
          m.estoqueAtual,
          new Date(m.data).toLocaleDateString(),
        ];
      }),
    });
    doc.save("movimentacoes.pdf");
  };

  return (
    <div className="flex relative">
      <Sidebar />
      <main className="flex-1 p-6 bg-white min-h-screen flex flex-col items-center text-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-blue-600 tracking-wide">
          Movimentação de Estoque
        </h1>

        <input
          type="text"
          placeholder="Filtrar produtos..."
          className="mb-6 p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 w-full max-w-6xl bg-gray-100 placeholder-gray-500"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <h2 className="text-3xl font-bold mb-4 text-blue-600">Estoque de Produtos</h2>

        <div className="w-full max-w-6xl bg-gray-50 shadow-md rounded-2xl mb-8">
          <table className="w-full text-left border-collapse rounded-2xl overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                {["Produto", "Estoque Final", "Ações"].map((header) => (
                  <th key={header} className="py-3 px-6">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50 transition-colors duration-200">
                  <td className="py-3 px-6 font-medium">{p.descricaoProduto}</td>
                  <td className="py-3 px-6 font-medium">{p.estoque}</td>
                  <td className="py-3 px-6 flex gap-3">
                    <button
                      onClick={() => openModal(p, "entrada")}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                      <FaPlus /> Entrada
                    </button>
                    <button
                      onClick={() => openModal(p, "saida")}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    >
                      <FaMinus /> Saída
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalOpen && modalProduto && (
          <form
            className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-4 animate-fade-in"
            onSubmit={(e) => {
              e.preventDefault();
              handleMovimentar();
            }}
          >
            <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              {modalTipo === "entrada" ? <FaPlus className="text-green-500" /> : <FaMinus className="text-red-500" />}
              {modalTipo === "entrada" ? "Registrar Entrada" : "Registrar Saída"} - {modalProduto.descricaoProduto}
            </h2>

            {error && <p className="text-red-600">{error}</p>}

            <input
              type="number"
              placeholder="Quantidade"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={modalQuantidade}
              onChange={(e) => handleQuantidadeChange(e.target.value)}
            />
            <input
              type="text"
              placeholder="Descrição"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={modalDescricao}
              onChange={(e) => setModalDescricao(e.target.value)}
            />

            <div className="flex justify-center gap-4 mt-2">
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-400 flex items-center gap-2"
                onClick={() => setModalOpen(false)}
              >
                <FaMinus /> Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2"
                disabled={loading}
              >
                <FaPlus /> {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        )}

        <h2 className="text-3xl font-bold mb-4 text-blue-600">Histórico de Movimentações</h2>

        <div className="w-full max-w-6xl bg-gray-50 shadow-md rounded-2xl mb-12">
          <table className="w-full text-left border-collapse rounded-2xl overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                {["Produto", "Descrição", "Quantidade", "Tipo", "Estoque Anterior", "Estoque Atual", "Data"].map(
                  (header) => (
                    <th key={header} className="py-3 px-6">{header}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map((m) => {
                const produto = produtos.find((p) => p.id === m.produtoId);
                return (
                  <tr key={m.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="py-3 px-6 font-medium">{produto?.descricaoProduto}</td>
                    <td className="py-3 px-6 font-medium">{m.descricao}</td>
                    <td className="py-3 px-6 font-medium">{m.quantidade}</td>
                    <td className={`py-3 px-6 font-medium ${m.quantidade > 0 ? "text-green-600" : "text-red-600"}`}>
                      {m.quantidade > 0 ? "Entrada" : "Saída"}
                    </td>
                    <td className="py-3 px-6 font-medium">{m.estoqueAnterior}</td>
                    <td className="py-3 px-6 font-medium">{m.estoqueAtual}</td>
                    <td className="py-3 px-6 font-medium">{new Date(m.data).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center w-full max-w-6xl mb-12">
          <Card
            title="Entradas"
            value={totalEntradas}
            icon={
              <div className="bg-green-600 p-5 rounded-full text-white text-3xl shadow-lg animate-pulse">
                <FaArrowDown />
              </div>
            }
            className="bg-gradient-to-r from-green-400 to-green-600 text-white shadow-xl transform hover:-translate-y-2 hover:scale-105 transition-transform"
          />
          <Card
            title="Saídas"
            value={totalSaidas}
            icon={
              <div className="bg-red-600 p-5 rounded-full text-white text-3xl shadow-lg animate-pulse">
                <FaArrowUp />
              </div>
            }
            className="bg-gradient-to-r from-red-400 to-red-600 text-white shadow-xl transform hover:-translate-y-2 hover:scale-105 transition-transform"
          />
          <Card
            title="Estoque Final"
            value={estoqueFinalTotal}
            icon={
              <div className="bg-blue-600 p-5 rounded-full text-white text-3xl shadow-lg animate-pulse">
                <FaBoxes />
              </div>
            }
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-xl transform hover:-translate-y-2 hover:scale-105 transition-transform"
          />
        </div>
      </main>
    </div>
  );
}