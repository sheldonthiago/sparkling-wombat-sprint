"use client";

import { useState } from 'react';
import { InventoryItem, PrinterSupply, InventoryMovement } from '@/types/inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Package, ArrowRightLeft, Calendar, Filter } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface ReportsTabProps {
  items: InventoryItem[];
  supplies: PrinterSupply[];
  movements: InventoryMovement[];
}

export function ReportsTab({ items, supplies, movements }: ReportsTabProps) {
  const [selectedType, setSelectedType] = useState('assets');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      showError('Nenhum dado para exportar');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Formatar datas
          if (value instanceof Date) {
            return `"${value.toLocaleDateString()}"`;
          }
          // Escapar valores que contêm vírgulas ou aspas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccess(`Relatório ${filename} exportado com sucesso!`);
  };

  const filterAssets = () => {
    let filteredItems = [...items];

    if (statusFilter) {
      filteredItems = filteredItems.filter(item => item.status === statusFilter);
    }

    if (categoryFilter) {
      filteredItems = filteredItems.filter(item => item.category === categoryFilter);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filteredItems = filteredItems.filter(item => 
        new Date(item.acquisitionDate) >= filterDate
      );
    }

    return filteredItems;
  };

  const filterSupplies = () => {
    let filteredSupplies = [...supplies];

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filteredSupplies = filteredSupplies.filter(supply => 
        supply.lastPurchaseDate && new Date(supply.lastPurchaseDate) >= filterDate
      );
    }

    return filteredSupplies;
  };

  const filterMovements = () => {
    let filteredMovements = [...movements];

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filteredMovements = filteredMovements.filter(movement => 
        new Date(movement.date) >= filterDate
      );
    }

    if (statusFilter) {
      filteredMovements = filteredMovements.filter(movement => movement.type === statusFilter);
    }

    return filteredMovements;
  };

  const getAssetHeaders = () => [
    'ID', 'Nome', 'Categoria', 'Tipo', 'Fabricante', 'Modelo', 'Número de Série',
    'Data de Aquisição', 'Validade da Garantia', 'Localização', 'Status',
    'Fornecedor', 'Nota Fiscal', 'Valor', 'Responsável', 'Email', 'Telefone', 'Matrícula'
  ];

  const getSupplyHeaders = () => [
    'ID', 'Nome', 'Tipo', 'Marca da Impressora', 'Modelo da Impressora',
    'Quantidade', 'Estoque Mínimo', 'Unidade', 'Custo Unitário', 'Valor Total',
    'Localização', 'Fornecedor', 'Última Compra', 'Próxima Compra'
  ];

  const getMovementHeaders = () => [
    'ID', 'ID do Item', 'Tipo', 'Quantidade', 'Motivo', 'Data', 'Usuário',
    'Destinatário', 'Data Prevista de Devolução', 'Setor'
  ];

  const formatAssetData = (item: InventoryItem) => [
    item.id,
    item.name,
    item.category,
    item.type,
    item.manufacturer,
    item.model,
    item.serialNumber,
    item.acquisitionDate.toLocaleDateString(),
    item.warrantyExpiry ? item.warrantyExpiry.toLocaleDateString() : '',
    item.location,
    item.status,
    item.supplier,
    item.invoiceNumber,
    item.value,
    item.assignedTo || '',
    item.assignedEmail || '',
    item.assignedPhone || '',
    item.assignedMatricula || ''
  ];

  const formatSupplyData = (supply: PrinterSupply) => [
    supply.id,
    supply.name,
    supply.type,
    supply.printerBrand,
    supply.printerModel,
    supply.quantity,
    supply.minStock,
    supply.unit,
    supply.costPerUnit,
    supply.quantity * supply.costPerUnit,
    supply.location,
    supply.supplier,
    supply.lastPurchaseDate ? supply.lastPurchaseDate.toLocaleDateString() : '',
    supply.nextPurchaseDate ? supply.nextPurchaseDate.toLocaleDateString() : ''
  ];

  const formatMovementData = (movement: InventoryMovement) => [
    movement.id,
    movement.itemId,
    movement.type,
    movement.quantity,
    movement.reason,
    movement.date.toLocaleDateString(),
    movement.user,
    movement.recipient || '',
    movement.returnDate ? movement.returnDate.toLocaleDateString() : '',
    movement.sector
  ];

  const exportAssets = () => {
    const filteredItems = filterAssets();
    const data = filteredItems.map(formatAssetData);
    exportToCSV([getAssetHeaders(), ...data], 'ativos');
  };

  const exportSupplies = () => {
    const filteredSupplies = filterSupplies();
    const data = filteredSupplies.map(formatSupplyData);
    exportToCSV([getSupplyHeaders(), ...data], 'suprimentos');
  };

  const exportSupplyMovements = () => {
    const supplyMovements = movements.filter(movement => 
      movement.itemId.startsWith('SUPPLY-')
    );
    const filteredMovements = filterMovements().filter(movement => 
      movement.itemId.startsWith('SUPPLY-')
    );
    const data = filteredMovements.map(formatMovementData);
    exportToCSV([getMovementHeaders(), ...data], 'saidas_suprimentos');
  };

  const exportAllMovements = () => {
    const filteredMovements = filterMovements();
    const data = filteredMovements.map(formatMovementData);
    exportToCSV([getMovementHeaders(), ...data], 'movimentacoes');
  };

  const getStatusOptions = () => [
    { value: 'available', label: 'Disponível' },
    { value: 'allocated', label: 'Alocado' },
    { value: 'maintenance', label: 'Em Manutenção' },
    { value: 'discarded', label: 'Descartado' },
    { value: 'entry', label: 'Entrada' },
    { value: 'exit', label: 'Saída' },
    { value: 'loan', label: 'Empréstimo' },
    { value: 'return', label: 'Devolução' },
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'discard', label: 'Descarte' }
  ];

  const getCategoryOptions = () => [
    'Notebooks',
    'Desktops',
    'Servidores',
    'Switches',
    'Roteadores',
    'Firewalls',
    'Access Points',
    'Monitores',
    'Impressoras',
    'Sistemas Operacionais',
    'Aplicativos de Escritório',
    'Ferramentas de Desenvolvimento',
    'Bancos de Dados',
    'Antivírus',
    'Backup',
    'Monitoramento',
    'Mouses',
    'Teclados',
    'Webcams',
    'Headsets',
    'Docks',
    'Tablets',
    'Smartphones',
    'Memória RAM',
    'Discos SSD',
    'Placas de Vídeo',
    'Processadores',
    'Placas Mãe',
    'Fontes',
    'Coolers',
    'Cabos Ethernet',
    'Adaptadores',
    'Conectores',
    'Suportes',
    'Organizadores',
    'Outros'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Relatórios</h2>
        <div className="flex gap-2">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder="Filtrar por data"
            className="w-48"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              {getStatusOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedType === 'assets' && (
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {getCategoryOptions().map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Tabs value={selectedType} onValueChange={setSelectedType} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Ativos
          </TabsTrigger>
          <TabsTrigger value="supplies" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Suprimentos
          </TabsTrigger>
          <TabsTrigger value="supply-movements" className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            Saídas de Suprimentos
          </TabsTrigger>
          <TabsTrigger value="movements" className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            Movimentações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Relatório de Ativos</span>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {filterAssets().length} ativos
                  </Badge>
                  <Button onClick={exportAssets}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                Exporte todos os ativos do sistema com filtros aplicados.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total de Ativos</p>
                  <p className="font-bold text-lg">{items.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Disponíveis</p>
                  <p className="font-bold text-lg text-green-600">
                    {items.filter(item => item.status === 'available').length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Alocados</p>
                  <p className="font-bold text-lg text-blue-600">
                    {items.filter(item => item.status === 'allocated').length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Em Manutenção</p>
                  <p className="font-bold text-lg text-yellow-600">
                    {items.filter(item => item.status === 'maintenance').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supplies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Relatório de Suprimentos</span>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {filterSupplies().length} suprimentos
                  </Badge>
                  <Button onClick={exportSupplies}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                Exporte todos os suprimentos de impressora do sistema.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total de Suprimentos</p>
                  <p className="font-bold text-lg">{supplies.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estoque Baixo</p>
                  <p className="font-bold text-lg text-yellow-600">
                    {supplies.filter(s => s.quantity <= s.minStock && s.quantity > 0).length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Esgotados</p>
                  <p className="font-bold text-lg text-red-600">
                    {supplies.filter(s => s.quantity === 0).length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor Total</p>
                  <p className="font-bold text-lg">
                    R$ {supplies.reduce((sum, s) => sum + (s.quantity * s.costPerUnit), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supply-movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Relatório de Saídas de Suprimentos</span>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {filterMovements().filter(m => m.itemId.startsWith('SUPPLY-')).length} movimentações
                  </Badge>
                  <Button onClick={exportSupplyMovements}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                Exporte todas as saídas de suprimentos registradas no sistema.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total de Saídas</p>
                  <p className="font-bold text-lg">
                    {movements.filter(m => m.itemId.startsWith('SUPPLY-') && m.type === 'exit').length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Este Mês</p>
                  <p className="font-bold text-lg">
                    {movements.filter(m => 
                      m.itemId.startsWith('SUPPLY-') && 
                      m.type === 'exit' && 
                      new Date(m.date).getMonth() === new Date().getMonth()
                    ).length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Setores</p>
                  <p className="font-bold text-lg">
                    {[...new Set(movements.filter(m => m.itemId.startsWith('SUPPLY-')).map(m => m.sector))].length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Retirado</p>
                  <p className="font-bold text-lg">
                    {movements
                      .filter(m => m.itemId.startsWith('SUPPLY-') && m.type === 'exit')
                      .reduce((sum, m) => sum + m.quantity, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Relatório de Movimentações</span>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {filterMovements().length} movimentações
                  </Badge>
                  <Button onClick={exportAllMovements}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                Exporte todas as movimentações de ativos e suprimentos registradas no sistema.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total de Movimentações</p>
                  <p className="font-bold text-lg">{movements.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Empréstimos</p>
                  <p className="font-bold text-lg text-blue-600">
                    {movements.filter(m => m.type === 'loan').length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Devoluções</p>
                  <p className="font-bold text-lg text-green-600">
                    {movements.filter(m => m.type === 'return').length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Este Mês</p>
                  <p className="font-bold text-lg">
                    {movements.filter(m => 
                      new Date(m.date).getMonth() === new Date().getMonth()
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}