"use client";

import { InventoryItem } from '@/types/inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Package, User, Calendar, MapPin } from 'lucide-react';
import { STATUSES } from '@/types/inventory';

interface InventoryListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  onAllocate: (id: string) => void;
  onReturn: (id: string) => void;
  onMaintenance: (id: string) => void;
}

export function InventoryList({ items, onEdit, onDelete, onAllocate, onReturn, onMaintenance }: InventoryListProps) {
  const getStatusColor = (status: string) => {
    const statusConfig = STATUSES.find(s => s.value === status);
    if (!statusConfig) return 'bg-gray-100 text-gray-800';
    
    switch (statusConfig.color) {
      case 'green': return 'bg-green-100 text-green-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'red': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusConfig = STATUSES.find(s => s.value === status);
    return statusConfig ? statusConfig.label : status;
  };

  const isWarrantyNearExpiry = (warrantyExpiry: Date | null) => {
    if (!warrantyExpiry) return false;
    const now = new Date();
    const timeDiff = warrantyExpiry.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 90 && daysDiff > 0;
  };

  const getWarrantyDays = (warrantyExpiry: Date | null) => {
    if (!warrantyExpiry) return null;
    const now = new Date();
    const timeDiff = warrantyExpiry.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum item encontrado</h3>
          <p className="text-gray-500">Adicione seu primeiro item ao inventário.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="relative">
          {/* Badge de garantia próxima do vencimento */}
          {isWarrantyNearExpiry(item.warrantyExpiry) && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="text-xs">
                Garantia em {getWarrantyDays(item.warrantyExpiry)} dias
              </Badge>
            </div>
          )}
          
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{item.category} • {item.manufacturer} {item.model}</p>
              </div>
              <Badge className={getStatusColor(item.status)}>
                {getStatusText(item.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Número de Série</p>
                <p className="font-medium text-sm">{item.serialNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Valor</p>
                <p className="font-medium">R$ {item.value.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nota Fiscal</p>
                <p className="font-medium text-sm">{item.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Aquisição</p>
                <p className="font-medium text-sm">{new Date(item.acquisitionDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Localização</p>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <p className="font-medium">{item.location}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fornecedor</p>
                <p className="font-medium">{item.supplier}</p>
              </div>
            </div>

            {item.assignedTo && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">Alocado para</p>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-gray-400" />
                  <p className="font-medium">{item.assignedTo}</p>
                </div>
              </div>
            )}

            {item.warrantyExpiry && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">Validade da Garantia</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className={`font-medium ${isWarrantyNearExpiry(item.warrantyExpiry) ? 'text-red-600' : ''}`}>
                    {new Date(item.warrantyExpiry).toLocaleDateString()}
                    {isWarrantyNearExpiry(item.warrantyExpiry) && ` (${getWarrantyDays(item.warrantyExpiry)} dias)`}
                  </p>
                </div>
              </div>
            )}

            {item.specifications && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">Especificações</p>
                <p className="text-sm font-medium">{item.specifications}</p>
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(item)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              
              {item.status === 'available' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAllocate(item.id)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Alocar
                </Button>
              )}
              
              {item.status === 'allocated' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReturn(item.id)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Devolver
                </Button>
              )}
              
              {item.status === 'available' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMaintenance(item.id)}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Manutenção
                </Button>
              )}
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}