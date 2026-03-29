"use client";

import { useState } from 'react';
import { PrinterSupply, PRINTER_SUPPLY_TYPES, UNITS } from '@/types/inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Printer, Package, AlertTriangle, CheckCircle, Minus, FileText } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface PrinterSupplyManagerProps {
  supplies: PrinterSupply[];
  onAddSupply: (supply: Omit<PrinterSupply, 'id'>) => void;
  onUpdateSupply: (id: string, updates: Partial<PrinterSupply>) => void;
  onRemoveSupply?: (id: string, quantity: number, reason: string) => void; // Nova prop para saída
}

export function PrinterSupplyManager({ supplies, onAddSupply, onUpdateSupply, onRemoveSupply }: PrinterSupplyManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRemoveForm, setShowRemoveForm] = useState(false);
  const [editingSupply, setEditingSupply] = useState<PrinterSupply | null>(null);
  const [removingSupply, setRemovingSupply] = useState<PrinterSupply | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'toner' as 'toner' | 'ink' | 'drum' | 'ribbon' | 'paper' | 'maintenance-kit',
    printerModel: '',
    printerBrand: '',
    quantity: 1,
    minStock: 1,
    unit: 'unidade',
    costPerUnit: 0,
    location: '',
    supplier: '',
    lastPurchaseDate: '',
    nextPurchaseDate: '',
    notes: ''
  });

  const [removeFormData, setRemoveFormData] = useState({
    quantity: 1,
    reason: '',
    date: new Date().toISOString().split('T')[0]
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'toner',
      printerModel: '',
      printerBrand: '',
      quantity: 1,
      minStock: 1,
      unit: 'unidade',
      costPerUnit: 0,
      location: '',
      supplier: '',
      lastPurchaseDate: '',
      nextPurchaseDate: '',
      notes: ''
    });
    setEditingSupply(null);
  };

  const resetRemoveForm = () => {
    setRemoveFormData({
      quantity: 1,
      reason: '',
      date: new Date().toISOString().split('T')[0]
    });
    setRemovingSupply(null);
  };

  const handleSubmit = () => {
    try {
      const supplyData = {
        ...formData,
        lastPurchaseDate: formData.lastPurchaseDate ? new Date(formData.lastPurchaseDate) : null,
        nextPurchaseDate: formData.nextPurchaseDate ? new Date(formData.nextPurchaseDate) : null,
      };

      if (editingSupply) {
        onUpdateSupply(editingSupply.id, supplyData);
        showSuccess('Suprimento atualizado com sucesso!');
      } else {
        onAddSupply(supplyData);
        showSuccess('Suprimento adicionado com sucesso!');
      }
      
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      showError('Erro ao salvar suprimento');
    }
  };

  const handleRemove = () => {
    if (!removingSupply || !onRemoveSupply) return;
    
    try {
      onRemoveSupply(removingSupply.id, removeFormData.quantity, removeFormData.reason);
      showSuccess(`${removeFormData.quantity} ${removingSupply.unit}(s) removido(s) com sucesso!`);
      resetRemoveForm();
      setShowRemoveForm(false);
    } catch (error) {
      showError('Erro ao remover suprimento');
    }
  };

  const getSupplyTypeConfig = (type: string) => {
    return PRINTER_SUPPLY_TYPES.find(t => t.value === type) || PRINTER_SUPPLY_TYPES[0];
  };

  const isLowStock = (quantity: number, minStock: number) => {
    return quantity <= minStock;
  };

  const isOutOfStock = (quantity: number) => {
    return quantity === 0;
  };

  const needsReorder = (quantity: number, minStock: number) => {
    return quantity <= minStock && quantity > 0;
  };

  const getTotalValue = (quantity: number, costPerUnit: number) => {
    return quantity * costPerUnit;
  };

  const canRemove = (supply: PrinterSupply, quantity: number) => {
    return supply.quantity >= quantity;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Suprimentos de Impressora</h3>
        <div className="flex gap-2">
          <Dialog open={showRemoveForm} onOpenChange={setShowRemoveForm}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => {
                if (supplies.length > 0) {
                  setRemovingSupply(supplies[0]);
                  resetRemoveForm();
                }
              }}>
                <Minus className="h-4 w-4 mr-2" />
                Registrar Saída
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Saída de Suprimento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Suprimento</Label>
                  <Select value={removingSupply?.id || ''} onValueChange={(value) => {
                    const supply = supplies.find(s => s.id === value);
                    setRemovingSupply(supply || null);
                    setRemoveFormData({
                      ...removeFormData,
                      quantity: 1
                    });
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o suprimento" />
                    </SelectTrigger>
                    <SelectContent>
                      {supplies.map((supply) => (
                        <SelectItem key={supply.id} value={supply.id}>
                          {supply.name} - {supply.quantity} {supply.unit} disponíveis
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {removingSupply && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Quantidade a Remover</Label>
                        <Input 
                          type="number"
                          min="1"
                          max={removingSupply.quantity}
                          value={removeFormData.quantity}
                          onChange={(e) => setRemoveFormData({
                            ...removeFormData,
                            quantity: parseInt(e.target.value) || 1
                          })}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Disponível: {removingSupply.quantity} {removingSupply.unit}
                        </p>
                      </div>
                      <div>
                        <Label>Data</Label>
                        <Input 
                          type="date"
                          value={removeFormData.date}
                          onChange={(e) => setRemoveFormData({
                            ...removeFormData,
                            date: e.target.value
                          })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Motivo da Saída</Label>
                      <Textarea 
                        value={removeFormData.reason}
                        onChange={(e) => setRemoveFormData({
                          ...removeFormData,
                          reason: e.target.value
                        })}
                        placeholder="Descreva o motivo da saída..."
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={handleRemove} 
                        disabled={!removingSupply || !removeFormData.reason || !canRemove(removingSupply, removeFormData.quantity)}
                      >
                        <Minus className="h-4 w-4 mr-2" />
                        Registrar Saída
                      </Button>
                      <Button variant="outline" onClick={() => { setShowRemoveForm(false); resetRemoveForm(); }}>
                        Cancelar
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setShowAddForm(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Suprimento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingSupply ? 'Editar Suprimento' : 'Adicionar Novo Suprimento'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome do Suprimento</Label>
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Toner HP 410"
                    />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRINTER_SUPPLY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Marca da Impressora</Label>
                    <Input 
                      value={formData.printerBrand}
                      onChange={(e) => setFormData({...formData, printerBrand: e.target.value})}
                      placeholder="Ex: HP, Canon, Epson"
                    />
                  </div>
                  <div>
                    <Label>Modelo da Impressora</Label>
                    <Input 
                      value={formData.printerModel}
                      onChange={(e) => setFormData({...formData, printerModel: e.target.value})}
                      placeholder="Ex: LaserJet Pro M404, PIXMA G6020"
                    />
                  </div>
                  <div>
                    <Label>Quantidade</Label>
                    <Input 
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label>Estoque Mínimo</Label>
                    <Input 
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label>Unidade</Label>
                    <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {UNITS.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Custo Unitário (R$)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={formData.costPerUnit}
                      onChange={(e) => setFormData({...formData, costPerUnit: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label>Localização</Label>
                    <Input 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Ex: Sala 201, Armazém A"
                    />
                  </div>
                  <div>
                    <Label>Fornecedor</Label>
                    <Input 
                      value={formData.supplier}
                      onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                      placeholder="Ex: HP, TechData"
                    />
                  </div>
                  <div>
                    <Label>Última Compra</Label>
                    <Input 
                      type="date"
                      value={formData.lastPurchaseDate}
                      onChange={(e) => setFormData({...formData, lastPurchaseDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Próxima Compra Prevista</Label>
                    <Input 
                      type="date"
                      value={formData.nextPurchaseDate}
                      onChange={(e) => setFormData({...formData, nextPurchaseDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Observações</Label>
                  <Textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Observações adicionais..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSubmit} disabled={!formData.name || !formData.printerBrand || !formData.printerModel}>
                    {editingSupply ? 'Atualizar' : 'Adicionar'}
                  </Button>
                  <Button variant="outline" onClick={() => { setShowAddForm(false); resetForm(); }}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {supplies.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Printer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum suprimento encontrado</h3>
            <p className="text-gray-500">Adicione seu primeiro suprimento de impressora.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {supplies.map((supply) => {
            const typeConfig = getSupplyTypeConfig(supply.type);
            const isLow = isLowStock(supply.quantity, supply.minStock);
            const isOut = isOutOfStock(supply.quantity);
            const needsReorder = isLow && !isOut;
            const totalValue = getTotalValue(supply.quantity, supply.costPerUnit);
            
            return (
              <Card key={supply.id} className={isOut ? 'border-red-200 bg-red-50' : needsReorder ? 'border-yellow-200 bg-yellow-50' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Printer className="h-5 w-5" />
                        {supply.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {supply.printerBrand} {supply.printerModel}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={typeConfig.color}>
                        {typeConfig.label}
                      </Badge>
                      {isOut && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Esgotado
                        </Badge>
                      )}
                      {needsReorder && (
                        <Badge variant="outline" className="text-xs text-yellow-700 border-yellow-300">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Reposição Necessária
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Quantidade</p>
                      <p className={`font-medium ${isOut ? 'text-red-600' : needsReorder ? 'text-yellow-600' : ''}`}>
                        {supply.quantity} {supply.unit}
                        {needsReorder && ` (mín: ${supply.minStock})`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor Total</p>
                      <p className="font-medium">R$ {totalValue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Localização</p>
                      <p className="font-medium">{supply.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fornecedor</p>
                      <p className="font-medium">{supply.supplier}</p>
                    </div>
                  </div>
                  
                  {supply.lastPurchaseDate && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Última Compra</p>
                      <p className="font-medium">{new Date(supply.lastPurchaseDate).toLocaleDateString()}</p>
                    </div>
                  )}

                  {supply.nextPurchaseDate && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Próxima Compra Prevista</p>
                      <p className="font-medium">{new Date(supply.nextPurchaseDate).toLocaleDateString()}</p>
                    </div>
                  )}

                  {supply.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Observações</p>
                      <p className="text-sm font-medium">{supply.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingSupply(supply);
                        setFormData({
                          name: supply.name,
                          type: supply.type,
                          printerModel: supply.printerModel,
                          printerBrand: supply.printerBrand,
                          quantity: supply.quantity,
                          minStock: supply.minStock,
                          unit: supply.unit,
                          costPerUnit: supply.costPerUnit,
                          location: supply.location,
                          supplier: supply.supplier,
                          lastPurchaseDate: supply.lastPurchaseDate?.toISOString().split('T')[0] || '',
                          nextPurchaseDate: supply.nextPurchaseDate?.toISOString().split('T')[0] || '',
                          notes: supply.notes
                        });
                        setShowAddForm(true);
                      }}
                    >
                      Editar
                    </Button>
                    
                    {onRemoveSupply && supply.quantity > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRemovingSupply(supply);
                          setRemoveFormData({
                            quantity: 1,
                            reason: '',
                            date: new Date().toISOString().split('T')[0]
                          });
                          setShowRemoveForm(true);
                        }}
                      >
                        <Minus className="h-4 w-4 mr-2" />
                        Registrar Saída
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}