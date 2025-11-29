"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Card from "@/components/Card";
import { FaBoxes, FaWarehouse, FaFilePdf, FaFileExcel } from "react-icons/fa";
import { api } from "@/services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

import { Produto } from "@/types";

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await api.get<Produto[]>("/estoque/produtos");
        setProdutos(res.data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar produtos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const totalProdutos = produtos.length;
  const totalEstoque = produtos.reduce((acc, p) => acc + p.estoque, 0);

  // Dados para gráfico
  const graficoData = produtos.map((p) => ({
    produto: p.descricaoProduto,
    estoque: p.estoque,
  }));

  const barColors = ["#3B82F6", "#FBBF24", "#10B981", "#EF4444", "#8B5CF6", "#F472B6"];

  // Exportar PDF
  const exportPDF = () => {
    const input = document.getElementById("tabelaEstoque");
    if (!input) return;

    const cloned = input.cloneNode(true) as HTMLElement;
    cloned.style.overflow = "visible";
    cloned.style.width = "auto";
    cloned.querySelectorAll<HTMLElement>("*").forEach((el) => {
      el.style.background = "#ffffff";
      el.style.color = "#000000";
      el.style.boxShadow = "none";
    });

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "-10000px";
    container.appendChild(cloned);
    document.body.appendChild(container);

    html2canvas(cloned, { scale: 2, scrollY: -window.scrollY }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 0;

      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
        if (heightLeft > 0) pdf.addPage();
      }

      pdf.save("estoque.pdf");
      document.body.removeChild(container);
    });
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(produtos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Estoque");
    XLSX.writeFile(wb, "estoque.xlsx");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl text-blue-700 animate-pulse">Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-blue-700 tracking-wide">Estoque</h1>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <Card title="Total de Produtos" value={`${totalProdutos}`} icon={<FaBoxes className="text-blue-500" />} />
          <Card title="Total em Estoque" value={`${totalEstoque}`} icon={<FaWarehouse className="text-green-500" />} />
          <Card
            title="Maior Estoque"
            value={
              produtos.length
                ? `${produtos.reduce((a, b) => (a.estoque > b.estoque ? a : b)).descricaoProduto} - ${produtos.reduce((a, b) => (a.estoque > b.estoque ? a : b)).estoque}`
                : "-"
            }
            icon={<FaWarehouse className="text-yellow-500" />}
          />
        </div>

        {/* Gráfico de estoque por produto */}
        <div className="bg-white p-6 rounded-3xl shadow-2xl mb-10 animate-fadeIn">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Estoque por Produto</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={graficoData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="produto" tick={{ fill: "#1E3A8A", fontWeight: 600 }} />
              <YAxis tick={{ fill: "#1E3A8A", fontWeight: 600 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1E40AF", borderRadius: 8, color: "#fff" }} />
              <Legend />
              <Bar dataKey="estoque" radius={[10, 10, 0, 0]}>
                {graficoData.map((_, index) => (
                  <Cell key={index} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-end mb-4 gap-2">
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg hover:bg-blue-800 transition-all"
          >
            <FaFilePdf /> Exportar PDF
          </button>
          <button
            onClick={exportExcel}
            className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg hover:bg-green-800 transition-all"
          >
            <FaFileExcel /> Exportar Excel
          </button>
        </div>

        {/* Tabela moderna */}
        <div id="tabelaEstoque" className="overflow-x-auto rounded-3xl shadow-2xl bg-white p-4 animate-fadeIn">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr>
                {["Código", "Produto", "Estoque"].map((header) => (
                  <th
                    key={header}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md text-left uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr
                  key={p.id}
                  className="bg-white hover:bg-blue-100/50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg rounded-xl"
                >
                  <td className="p-4 font-medium text-gray-800">{p.codigoProduto}</td>
                  <td className="p-4 font-semibold text-blue-700">{p.descricaoProduto}</td>
                  <td className="p-4 font-semibold text-green-700">{p.estoque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}