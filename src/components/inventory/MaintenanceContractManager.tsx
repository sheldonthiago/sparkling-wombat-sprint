"use client";

import { useState } from 'react';
import { MaintenanceContract } from '@/types/inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, FileText, Calendar, DollarSign } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface MaintenanceContractManagerProps {
  contracts: MaintenanceContract[];
  onAddContract: (contract: Omit<MaintenanceContract, 'id'>) => void;
  onUpdateContract: (id: string, updates: Partial<MaintenanceContract>) => void;
}

export function MaintenanceContractManager({ contracts, onAddContract, onUpdateContract }: MaintenanceContractManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContract, setEditingContract] = useState<MaintenanceContract | null>(null);
  const [formData, setFormData] = useState({
    equipmentId: '',
    provider: '',
    startDate: '',
    endDate: '',
    serviceLevel: '',
    cost: 0,
    status: 'active' as 'active' | 'expired' | 'cancelled',
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      equipmentId: '',
      provider: '',
      startDate: '',
      endDate: '',
      serviceLevel: '',
      cost: 0,
      status: 'active',
      notes: ''
    });
    setEditingContract(null);
  };

  const handleSubmit = () => {
    try {
      const contractData = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate)
      };

      if (editingContract) {
        onUpdateContract(editingContract.id, contractData);
        showSuccess('Contrato atualizado com sucesso!');
      } else {
        onAddContract(contractData);
        showSuccess('Contrato adicionado com sucesso!');
      }
      
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      showError('Erro ao salvar contrato');
    }
  };

  const getContractStatus = (status: string, endDate: Date) => {
    const now = new Date();
    if (status === 'cancelled') return { label: 'Cancelado', color: 'bg-gray-100 text-gray-800' };
    if (status === 'expired' || now > endDate) return { label: 'Expirado', color: 'bg-red-100 text-red-800' };
    return { label: 'Ativo', color: 'bg-green-100 text-green-800' };
  };

  const isExpiringSoon = (endDate: Date) => {
    const now = new Date();
    const timeDiff = endDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 90 && daysDiff > 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Contratos de Manutenção</h3>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setShowAddForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Contrato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingContract ? 'Editar Contrato' : 'Adicionar Novo Contrato'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>ID do Equipamento</Label>
                  <Input 
                    value={formData.equipmentId}
                    onChange={(e) => setFormData({...formData, equipmentId: e.target.value})}
                    placeholder="Ex: EQ-001"
                  />
                </div>
                <div>
                  <Label>Prestador de Serviço</Label>
                  <Input 
                    value={formData.provider}
                    onChange={(e) => setFormData({...formData, provider: e.target.value})}
                    placeholder="Ex: TechData, Dell Services"
                  />
                </div>
                <div>
                  <Label>Nível de Serviço</Label>
                  <Select value={formData.serviceLevel} onValueChange={(value) => setFormData({...formData, serviceLevel: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível de serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="standard">Padrão</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="expired">Expirado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Data Início</Label>
                  <Input 
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Data Fim</Label>
                  <Input 
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Valor (R$)</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <div>
                <Label>Observações</Label>
                <Textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Detalhes do contrato, escopo dos serviços, etc."
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={!formData.provider || !formData.startDate || !formData.endDate}>
                  {editingContract ? 'Atualizar' : 'Adicionar'}
                </Button>
                <Button variant="outline" onClick={() => { setShowAddForm(false); resetForm(); }}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {contracts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum contrato encontrado</h3>
            <p className="text-gray-500">Adicione seu primeiro contrato de manutenção.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contracts.map((contract) => {
            const status = getContractStatus(contract.status, contract.endDate);
            
            return (
              <Card key={contract.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{contract.provider}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Equipamento: {contract.equipmentId}</p>
                    </div>
                    <Badge className={status.color}>
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Nível de Serviço</p>
                      <p className="font-medium">{contract.serviceLevel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor do Contrato</p>
                      <p className="font-medium">R$ {contract.cost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data Início</p>
                      <p className="font-medium">{new Date(contract.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data Fim</p>
                      <p className={`font-medium ${isExpiringSoon(contract.endDate) ? 'text-yellow-600' : ''}`}>
                        {new Date(contract.endDate).toLocaleDateString()}
                        {isExpiringSoon(contract.endDate) && ` (${Math.ceil((contract.endDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24))} dias)`}
                      </p>
                    </div>
                  </div>
                  
                  {contract.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Observações</p>
                      <p className="text-sm font-medium">{contract.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingContract(contract);
                        setFormData({
                          equipmentId: contract.equipmentId,
                          provider: contract.provider,
                          startDate: contract.startDate.toISOString().split('T')[0],
                          endDate: contract.endDate.toISOString().split('T')[0],
                          serviceLevel: contract.serviceLevel,
                          cost: contract.cost,
                          status: contract.status,
                          notes: contract.notes
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