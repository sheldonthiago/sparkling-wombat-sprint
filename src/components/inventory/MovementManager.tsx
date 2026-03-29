"use client";

import { useState } from 'react';
import { InventoryMovement, MOVEMENT_TYPES } from '@/types/inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, ArrowRightLeft, Calendar, User, Package, AlertTriangle, Building } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface MovementManagerProps {
  movements: InventoryMovement[];
  items: any[]; // Para selecionar o item
  onAddMovement: (movement: Omit<InventoryMovement, 'id'>) => void;
}

export function MovementManager({ movements, items, onAddMovement }: MovementManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    itemId: '',
    type: 'entry' as 'entry' | 'exit' | 'loan' | 'return' | 'maintenance' | 'discard',
    quantity: 1,
    reason: '',
    date: new Date().toISOString().split('T')[0],
    user: '',
    recipient: '',
    returnDate: '',
    sector: '' // Novo campo de setor
  });

  const resetForm = () => {
    setFormData({
      itemId: '',
      type: 'entry',
      quantity: 1,
      reason: '',
      date: new Date().toISOString().split('T')[0],
      user: '',
      recipient: '',
      returnDate: '',
      sector: ''
    });
  };

  const handleSubmit = () => {
    try {
      const movementData = {
        ...formData,
        itemId: formData.itemId,
        quantity: parseInt(formData.quantity),
        date: new Date(formData.date),
        user: formData.user || 'Sistema',
        recipient: formData.recipient || undefined,
        returnDate: formData.returnDate ? new Date(formData.returnDate) : undefined,
      };

      onAddMovement(movementData);
      showSuccess('Movimentação registrada com sucesso!');
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      showError('Erro ao registrar movimentação');
    }
  };

  const getTypeConfig = (type: string) => {
    return MOVEMENT_TYPES.find(t => t.value === type) || MOVEMENT_TYPES[0];
  };

  const getItemName = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.name : 'Item não encontrado';
  };

  const getItemSerial = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.serialNumber : '';
  };

  const getItemSector = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.location : 'Não informado';
  };

  const isOverdue = (returnDate: Date | null) => {
    if (!returnDate) return false;
    return new Date() > returnDate;
  };

  const getOverdueDays = (returnDate: Date | null) => {
    if (!returnDate) return null;
    const now = new Date();
    const timeDiff = now.getTime() - returnDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  // Ordenar por data (mais recente primeiro)
  const sortedMovements = [...movements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Movimentações de Ativos</h3>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setShowAddForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Movimentação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nova Movimentação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Ativo</Label>
                  <Select value={formData.itemId} onValueChange={(value) => setFormData({...formData, itemId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ativo" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} ({item.manufacturer} {item.model})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tipo de Movimentação</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOVEMENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Setor</Label>
                  <Input 
                    value={formData.sector}
                    onChange={(e) => setFormData({...formData, sector: e.target.value})}
                    placeholder="Ex: TI, Financeiro, RH"
                  />
                </div>
                <div>
                  <Label>Quantidade</Label>
                  <Input 
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                  />
                </div>
                <div>
                  <Label>Data</Label>
                  <Input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Usuário</Label>
                  <Input 
                    value={formData.user}
                    onChange={(e) => setFormData({...formData, user: e.target.value})}
                    placeholder="Nome do usuário responsável"
                  />
                </div>
                {formData.type === 'loan' && (
                  <div>
                    <Label>Destinatário</Label>
                    <Input 
                      value={formData.recipient}
                      onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                      placeholder="Para quem foi emprestado"
                    />
                  </div>
                )}
                {formData.type === 'loan' && (
                  <div>
                    <Label>Data Prevista de Devolução</Label>
                    <Input 
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
                    />
                  </div>
                )}
              </div>
              
              <div>
                <Label>Motivo/Observações</Label>
                <Textarea 
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Descreva o motivo da movimentação..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={!formData.itemId || !formData.reason}>
                  Registrar Movimentação
                </Button>
                <Button variant="outline" onClick={() => { setShowAddForm(false); resetForm(); }}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {movements.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <ArrowRightLeft className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma movimentação encontrada</h3>
            <p className="text-gray-500">Registre a primeira movimentação de ativo.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedMovements.map((movement) => {
            const typeConfig = getTypeConfig(movement.type);
            const overdue = isOverdue(movement.returnDate);
            const overdueDays = getOverdueDays(movement.returnDate);
            
            return (
              <Card key={movement.id} className={overdue ? 'border-red-200 bg-red-50' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {getItemName(movement.itemId)}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Série: {getItemSerial(movement.itemId)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={typeConfig.color}>
                        {typeConfig.label}
                      </Badge>
                      {overdue && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Atrasado {overdueDays} dias
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Setor</p>
                      <p className="font-medium flex items-center gap-1">
                        <Building className="h-4 w-4 text-gray-400" />
                        {movement.sector || getItemSector(movement.itemId)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Quantidade</p>
                      <p className="font-medium">{movement.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(movement.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Usuário</p>
                      <p className="font-medium flex items-center gap-1">
                        <User className="h-4 w-4 text-gray-400" />
                        {movement.user}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Destinatário</p>
                      <p className="font-medium">{movement.recipient || '-'}</p>
                    </div>
                  </div>
                  
                  {movement.returnDate && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Data Prevista de Devolução</p>
                      <p className={`font-medium ${overdue ? 'text-red-600' : ''}`}>
                        {new Date(movement.returnDate).toLocaleDateString()}
                        {overdue && ` (${overdueDays} dias atrasado)`}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500">Motivo</p>
                    <p className="text-sm font-medium">{movement.reason}</p>
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