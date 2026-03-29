"use client";

import { useState } from 'react';
import { Maintenance, MAINTENANCE_TYPES, MAINTENANCE_STATUSES, MAINTENANCE_PRIORITIES } from '@/types/inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Wrench, Calendar, DollarSign, User, AlertTriangle } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface MaintenanceManagerProps {
  maintenances: Maintenance[];
  items: any[]; // Para selecionar o item
  onAddMaintenance: (maintenance: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateMaintenance: (id: string, updates: Partial<Maintenance>) => void;
}

export function MaintenanceManager({ maintenances, items, onAddMaintenance, onUpdateMaintenance }: MaintenanceManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null);
  const [formData, setFormData] = useState({
    itemId: '',
    title: '',
    description: '',
    type: 'preventive' as 'preventive' | 'corrective',
    status: 'scheduled' as 'scheduled' | 'in_progress' | 'completed' | 'cancelled',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    startDate: '',
    endDate: '',
    responsible: '',
    responsibleEmail: '',
    responsiblePhone: '',
    responsibleMatricula: '',
    cost: 0,
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      itemId: '',
      title: '',
      description: '',
      type: 'preventive',
      status: 'scheduled',
      priority: 'medium',
      startDate: '',
      endDate: '',
      responsible: '',
      responsibleEmail: '',
      responsiblePhone: '',
      responsibleMatricula: '',
      cost: 0,
      notes: ''
    });
    setEditingMaintenance(null);
  };

  const handleSubmit = () => {
    try {
      const maintenanceData = {
        ...formData,
        itemId: formData.itemId,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        cost: parseFloat(formData.cost) || 0,
      };

      if (editingMaintenance) {
        onUpdateMaintenance(editingMaintenance.id, maintenanceData);
        showSuccess('Manutenção atualizada com sucesso!');
      } else {
        onAddMaintenance(maintenanceData);
        showSuccess('Manutenção adicionada com sucesso!');
      }
      
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      showError('Erro ao salvar manutenção');
    }
  };

  const getTypeConfig = (type: string) => {
    return MAINTENANCE_TYPES.find(t => t.value === type) || MAINTENANCE_TYPES[0];
  };

  const getStatusConfig = (status: string) => {
    return MAINTENANCE_STATUSES.find(s => s.value === status) || MAINTENANCE_STATUSES[0];
  };

  const getPriorityConfig = (priority: string) => {
    return MAINTENANCE_PRIORITIES.find(p => p.value === priority) || MAINTENANCE_PRIORITIES[0];
  };

  const getItemName = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    return item ? item.name : 'Item não encontrado';
  };

  const isOverdue = (endDate: Date | null, status: string) => {
    if (!endDate || status === 'completed' || status === 'cancelled') return false;
    return new Date() > endDate;
  };

  const getOverdueDays = (endDate: Date | null) => {
    if (!endDate) return null;
    const now = new Date();
    const timeDiff = now.getTime() - endDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Ordens de Serviço</h3>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setShowAddForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Manutenção
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMaintenance ? 'Editar Manutenção' : 'Adicionar Nova Manutenção'}
              </DialogTitle>
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
                  <Label>Título da Manutenção</Label>
                  <Input 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ex: Troca de memória RAM"
                  />
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {MAINTENANCE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Prioridade</Label>
                  <Select value={formData.priority} onValueChange={(value: any) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      {MAINTENANCE_PRIORITIES.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Data Início</Label>
                  <Input 
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Data Prevista Fim</Label>
                  <Input 
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Responsável</Label>
                  <Input 
                    value={formData.responsible}
                    onChange={(e) => setFormData({...formData, responsible: e.target.value})}
                    placeholder="Ex: João Silva, TI"
                  />
                </div>
                <div>
                  <Label>Custo (R$)</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>

              {/* Campos de contato do responsável */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Email do Responsável</Label>
                  <Input 
                    type="email" 
                    value={formData.responsibleEmail}
                    onChange={(e) => setFormData({...formData, responsibleEmail: e.target.value})}
                    placeholder="exemplo@empresa.com"
                  />
                </div>
                <div>
                  <Label>Telefone do Responsável</Label>
                  <Input 
                    value={formData.responsiblePhone}
                    onChange={(e) => setFormData({...formData, responsiblePhone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label>Matrícula do Responsável</Label>
                  <Input 
                    value={formData.responsibleMatricula}
                    onChange={(e) => setFormData({...formData, responsibleMatricula: e.target.value})}
                    placeholder="Ex: 123456"
                  />
                </div>
              </div>
              
              <div>
                <Label>Descrição</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descrição detalhada da manutenção..."
                  className="min-h-[100px]"
                />
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
                <Button onClick={handleSubmit} disabled={!formData.itemId || !formData.title || !formData.startDate}>
                  {editingMaintenance ? 'Atualizar' : 'Adicionar'}
                </Button>
                <Button variant="outline" onClick={() => { setShowAddForm(false); resetForm(); }}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {maintenances.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma manutenção encontrada</h3>
            <p className="text-gray-500">Adicione sua primeira ordem de serviço.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {maintenances.map((maintenance) => {
            const typeConfig = getTypeConfig(maintenance.type);
            const statusConfig = getStatusConfig(maintenance.status);
            const priorityConfig = getPriorityConfig(maintenance.priority);
            const overdue = isOverdue(maintenance.endDate, maintenance.status);
            const overdueDays = getOverdueDays(maintenance.endDate);
            
            return (
              <Card key={maintenance.id} className={overdue ? 'border-red-200 bg-red-50' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Wrench className="h-5 w-5" />
                        {maintenance.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Ativo: {getItemName(maintenance.itemId)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={typeConfig.color}>
                        {typeConfig.label}
                      </Badge>
                      <Badge className={statusConfig.color}>
                        {statusConfig.label}
                      </Badge>
                      <Badge className={priorityConfig.color}>
                        {priorityConfig.label}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Data Início</p>
                      <p className="font-medium text-sm">{new Date(maintenance.startDate).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data Prevista Fim</p>
                      <p className={`font-medium text-sm ${overdue ? 'text-red-600' : ''}`}>
                        {maintenance.endDate ? new Date(maintenance.endDate).toLocaleString() : 'Não definida'}
                        {overdue && ` (${overdueDays} dias atrasado)`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Custo</p>
                      <p className="font-medium">R$ {maintenance.cost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Criado por</p>
                      <p className="font-medium">{maintenance.createdBy}</p>
                    </div>
                  </div>
                  
                  {/* Informações do responsável */}
                  {maintenance.responsible && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-2">Informações do Responsável</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-blue-600">Nome</p>
                          <p className="font-medium text-sm flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {maintenance.responsible}
                          </p>
                        </div>
                        {maintenance.responsibleEmail && (
                          <div>
                            <p className="text-xs text-blue-600">Email</p>
                            <p className="font-medium text-sm flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {maintenance.responsibleEmail}
                            </p>
                          </div>
                        )}
                        {maintenance.responsiblePhone && (
                          <div>
                            <p className="text-xs text-blue-600">Telefone</p>
                            <p className="font-medium text-sm flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {maintenance.responsiblePhone}
                            </p>
                          </div>
                        )}
                        {maintenance.responsibleMatricula && (
                          <div>
                            <p className="text-xs text-blue-600">Matrícula</p>
                            <p className="font-medium text-sm flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {maintenance.responsibleMatricula}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {maintenance.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Descrição</p>
                      <p className="text-sm font-medium">{maintenance.description}</p>
                    </div>
                  )}

                  {maintenance.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Observações</p>
                      <p className="text-sm font-medium">{maintenance.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingMaintenance(maintenance);
                        setFormData({
                          itemId: maintenance.itemId,
                          title: maintenance.title,
                          description: maintenance.description,
                          type: maintenance.type,
                          status: maintenance.status,
                          priority: maintenance.priority,
                          startDate: maintenance.startDate.toISOString().slice(0, 16),
                          endDate: maintenance.endDate?.toISOString().slice(0, 16) || '',
                          responsible: maintenance.responsible,
                          responsibleEmail: maintenance.responsibleEmail || '',
                          responsiblePhone: maintenance.responsiblePhone || '',
                          responsibleMatricula: maintenance.responsibleMatricula || '',
                          cost: maintenance.cost,
                          notes: maintenance.notes
                        });
                        setShowAddForm(true);
                      }}
                    >
                      Editar
                    </Button>
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