"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { useSupabaseInventory } from "@/hooks/use-supabase-inventory";
import { InventoryItem } from "@/types/inventory";
import { PrinterSupply } from "@/types/inventory";
import { Maintenance } from "@/types/inventory";
import { InventoryMovement } from "@/types/inventory";

/** Helper to convert array to CSV */
function arrayToCsv(rows: string[][], fileName: string) {
  const csvContent = [
    rows[0], // header
    ...rows.slice(1), // data rows
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** Export Assets (Inventário) */
function exportAssets(items: InventoryItem[]) {
  const headers = [
    "ID",
    "Nome",
    "Categoria",
    "Tipo",
    "Fabricante",
    "Modelo",
    "Status",
    "Localização",
    "Fornecedor",
    "Valor (R$)",
    "Número da Nota Fiscal",
    "Número de Série",
    "Data de Aquisição",
    "Validade da Garantia",
  ];
  const rows: string[][] = items.map((item) => [
    item.id,
    `"${item.name}"`,
    item.category,
    item.type,
    `"${item.manufacturer}"`,
    `"${item.model}"`,
    item.status,
    `"${item.location}"`,
    `"${item.supplier}"`,
    item.value.toFixed(2),
    `"${item.invoiceNumber}"`,
    item.serialNumber,
    new Date(item.acquisitionDate).toLocaleDateString(),
    item.warrantyExpiry ? new Date(item.warrantyExpiry).toLocaleDateString() : "",
  ]);
  arrayToCsv(rows, "ativos.csv");
}

/** Export Suprimentos de Impressora */
function exportSupplies(supplies: PrinterSupply[]) {
  const headers = [
    "ID",
    "Nome",
    "Tipo",
    "Marca da Impressora",
    "Modelo da Impressora",
    "Quantidade",
    "Estoque Mínimo",
    "Unidade",
    "Custo Unitário (R$)",
    "Localização",
    "Fornecedor",
    "Última Compra",
    "Próxima Compra",
    "Observações",
  ];
  const rows: string[][] = supplies.map((supply) => [
    supply.id,
    `"${supply.name}"`,
    supply.type,
    `"${supply.printerBrand}"`,
    `"${supply.printerModel}"`,
    supply.quantity.toString(),
    supply.minStock.toString(),
    supply.unit,
    supply.costPerUnit.toFixed(2),
    `"${supply.location}"`,
    `"${supply.supplier}"`,
    supply.lastPurchaseDate ? new Date(supply.lastPurchaseDate).toLocaleDateString() : "",
    supply.nextPurchaseDate ? new Date(supply.nextPurchaseDate).toLocaleDateString() : "",
    `"${supply.notes}"`,
  ]);
  arrayToCsv(rows, "suprimentos-impressora.csv");
}

/** Export Saídas de Suprimentos (Movimentações de Saída) */
function exportSupplyExits(movements: InventoryMovement[]) {
  const headers = [
    "ID",
    "Item",
    "Setor",
    "Tipo",
    "Quantidade",
    "Data",
    "Usuário",
    "Motivo/Observações",
    "Destinatário",
    "Data Prevista de Devolução",
  ];
  const rows: string[][] = movements
    .filter((m) => m.type === "exit" || m.type === "discard")
    .map((movement) => [
      movement.id,
      movement.itemId,
      movement.sector || "",
      movement.type,
      movement.quantity.toString(),
      new Date(movement.date).toLocaleDateString(),
      movement.user,
      movement.reason,
      movement.recipient || "",
      movement.returnDate ? new Date(movement.returnDate).toLocaleDateString() : "",
    ]);
  arrayToCsv(rows, "saidas-supprimentos.csv");
}

/** Export Manutenções */
function exportMaintenance(maintenances: Maintenance[]) {
  const headers = [
    "ID",
    "Item",
    "Título",
    "Descrição",
    "Tipo",
    "Status",
    "Prioridade",
    "Ordem de Serviço",
    "Data Início",
    "Data Prevista Fim",
    "Responsável",
    "Custo (R$)",
    "Notas",
  ];
  const rows: string[][] = maintenances.map((m) => [
    m.id,
    m.itemId,
    m.title,
    m.description,
    m.type,
    m.status,
    m.priority,
    m.serviceOrder || "",
    m.startDate.toLocaleString(),
    m.endDate ? m.endDate.toLocaleDateString() : "",
    m.responsible,
    m.cost.toFixed(2),
    `"${m.notes}"`,
  ]);
  arrayToCsv(rows, "manutencoes.csv");
}

/** Export Movimentações */
function exportMovements(movements: InventoryMovement[]) {
  const headers = [
    "ID",
    "Item",
    "Setor",
    "Tipo",
    "Quantidade",
    "Data",
    "Usuário",
    "Destinatário",
    "Data Prevista de Devolução",
    "Motivo/Observações",
  ];
  const rows: string[][] = movements.map((movement) => [
    movement.id,
    movement.itemId,
    movement.sector || "",
    movement.type,
    movement.quantity.toString(),
    new Date(movement.date).toLocaleDateString(),
    movement.user,
    movement.recipient || "",
    movement.returnDate ? new Date(movement.returnDate).toLocaleDateString() : "",
    movement.reason,
  ]);
  arrayToCsv(rows, "movimentacoes.csv");
}

export function ExportManager({
  items,
  movements,
  supplies,
  maintenances,
}) {
  return (
    <div className="flex gap-4 mb-6">
      <Button
        variant="outline"
        onClick={() => exportAssets(items)}
        className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg shadow-sm hover:shadow-blue-500/30"
      >
        <DownloadIcon className="h-5 w-5" />
        Exportar Ativos      </Button>

      <Button
        variant="outline"
        onClick={() => exportSupplies(supplies)}
        className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg shadow-sm hover:shadow-green-500/30"
      >
        <DownloadIcon className="h-5 w-5" />
        Exportar Suprimentos      </Button>

      <Button
        variant="outline"
        onClick={() => exportSupplyExits(movements)}
        className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white rounded-lg shadow-sm hover:shadow-red-500/30"
      >
        <DownloadIcon className="h-5 w-5" />
        Exportar Saídas de Suprimentos
      </Button>

      <Button
        variant="outline"
        onClick={() => exportMaintenance(maintenances)}
        className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow-sm hover:shadow-purple-500/30"
      >
        <DownloadIcon className="h-5 w-5" />
        Exportar Manutenções
      </Button>

      <Button
        variant="outline"
        onClick={() => exportMovements(movements)}
        className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-slate-600 hover:from-slate-700 hover:to-slate-700 text-white rounded-lg shadow-sm hover:shadow-slate-500/30"
      >
        <DownloadIcon className="h-5 w-5" />
        Exportar Movimentações
      </Button>
    </div>
  );
}