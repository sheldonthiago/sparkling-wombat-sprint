"use client";

import { useState } from 'react';
import { SoftwareLicense } from '@/types/inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Key, Calendar, Users } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface SoftwareLicenseManagerProps {
  licenses: SoftwareLicense[];
  onAddLicense: (license: Omit<SoftwareLicense, 'id'>) => void;
  onUpdateLicense: (id: string, updates: Partial<SoftwareLicense>) => void;
}

export function SoftwareLicenseManager({ licenses, onAddLicense, onUpdateLicense }: SoftwareLicenseManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLicense, setEditingLicense] = useState<SoftwareLicense | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    key: '',
    quantity: 1,
    usedQuantity: 0,
    expiryDate: '',
    supplier: '',
    value: 0,
    notes: '',
    assignedTo: [] as string[]
  });

  const resetForm = () => {
    setFormData({
      name: '',
      version: '',
      key: '',
      quantity: 1,
      usedQuantity: 0,
      expiryDate: '',
      supplier: '',
      value: 0,
      notes: '',
      assignedTo: []
    });
    setEditingLicense(null);
  };

  const handleSubmit = () => {
    try {
      const licenseData = {
        ...formData,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
        assignedTo: formData.assignedTo
      };

      if (editingLicense) {
        onUpdateLicense(editingLicense.id, licenseData);
        showSuccess('Licença atualizada com sucesso!');
      } else {
        onAddLicense(licenseData);
        showSuccess('Licença adicionada com sucesso!');
      }
      
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      showError('Erro ao salvar licença');
    }
  };

  const isExpiringSoon = (expiryDate: Date | null) => {
    if (!expiryDate) return false;
    const now = new Date();
    const timeDiff = expiryDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 30 && daysDiff > 0;
  };

  const isExpired = (expiryDate: Date | null) => {
    if (!expiryDate) return false;
    return new Date() > expiryDate;
  };

  const getLicenseStatus = (expiryDate: Date | null, usedQuantity: number, quantity: number) => {
    if (isExpired(expiryDate)) return { label: 'Expirada', color: 'bg-red-100 text-red-800' };
    if (isExpiringSoon(expiryDate)) return { label: 'Expirando', color: 'bg-yellow-100 text-yellow-800' };
    if (usedQuantity >= quantity) return { label: 'Esgotada', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Ativa', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Licenças de Software</h3>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setShowAddForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Licença
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingLicense ? 'Editar Licença' : 'Adicionar Nova Licença'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome do Software</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Microsoft Office 365"
                  />
                </div>
                <div>
                  <Label>Versão</Label>
                  <Input 
                    value={formData.version}
                    onChange={(e) => setFormData({...formData, version: e.target.value})}
                    placeholder="Ex: 2021"
                  />
                </div>
                <div>
                  <Label>Chave da Licença</Label>
                  <Input 
                    value={formData.key}
                    onChange={(e) => setFormData({...formData, key: e.target.value})}
                    placeholder="Ex: XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                  />
                </div>
                <div>
                  <Label>Fornecedor</Label>
                  <Input 
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    placeholder="Ex: Microsoft, TechData"
                  />
                </div>
                <div>
                  <Label>Quantidade Total</Label>
                  <Input 
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label>Quantidade Usada</Label>
                  <Input 
                    type="number"
                    value={formData.usedQuantity}
                    onChange={(e) => setFormData({...formData, usedQuantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label>Valor Unitário (R$)</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label>Data de Expiração</Label>
                  <Input 
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
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
                <Button onClick={handleSubmit} disabled={!formData.name || !formData.key}>
                  {editingLicense ? 'Atualizar' : 'Adicionar'}
                </Button>
                <Button variant="outline" onClick={() => { setShowAddForm(false); resetForm(); }}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {licenses.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma licença encontrada</h3>
            <p className="text-gray-500">Adicione sua primeira licença de software.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {licenses.map((license) => {
            const status = getLicenseStatus(license.expiryDate, license.usedQuantity, license.quantity);
            const available = license.quantity - license.usedQuantity;
            
            return (
              <Card key={license.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{license.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Versão {license.version}</p>
                    </div>
                    <Badge className={status.color}>
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Chave da Licença</p>
                      <p className="font-medium text-sm font-mono">{license.key}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Disponíveis</p>
                      <p className="font-medium">{available} de {license.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor Total</p>
                      <p className="font-medium">R$ {(license.value * license.quantity).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fornecedor</p>
                      <p className="font-medium">{license.supplier}</p>
                    </div>
                  </div>
                  
                  {license.expiryDate && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Data de Expiração</p>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className={`font-medium ${isExpired(license.expiryDate) ? 'text-red-600' : isExpiringSoon(license.expiryDate) ? 'text-yellow-600' : ''}`}>
                          {new Date(license.expiryDate).toLocaleDateString()}
                          {isExpiringSoon(license.expiryDate) && ` (${Math.ceil((license.expiryDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24))} dias)`}
                          {isExpired(license.expiryDate) && ' (Expirada)'}
                        </p>
                      </div>
                    </div>
                  )}

                  {license.assignedTo.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Atribuído a</p>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <p className="font-medium">{license.assignedTo.join(', ')}</p>
                      </div>
                    </div>
                  )}

                  {license.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">Observações</p>
                      <p className="text-sm font-medium">{license.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingLicense(license);
                        setFormData({
                          name: license.name,
                          version: license.version,
                          key: license.key,
                          quantity: license.quantity,
                          usedQuantity: license.usedQuantity,
                          expiryDate: license.expiryDate?.toISOString().split('T')[0] || '',
                          supplier: license.supplier,
                          value: license.value,
                          notes: license.notes,
                          assignedTo: license.assignedTo
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