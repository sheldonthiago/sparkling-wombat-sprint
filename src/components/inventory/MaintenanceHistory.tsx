"use client";

import { Maintenance } from '@/types/inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, Calendar, DollarSign, User, AlertTriangle } from 'lucide-react';
import { MAINTENANCE_TYPES, MAINTENANCE_STATUSES, MAINTENANCE_PRIORITIES } from '@/types/inventory';

interface MaintenanceHistoryProps {
  maintenances: Maintenance[];
  itemName: string;
}

export function MaintenanceHistory({ maintenances, itemName }: MaintenanceHistoryProps) {
  const getTypeConfig = (type: string) => {
    return MAINTENANCE_TYPES.find(t => t.value === type) || MAINTENANCE_TYPES[0];
  };

  const getStatusConfig = (status: string) => {
    return MAINTENANCE_STATUSES.find(s => s.value === status) || MAINTENANCE_STATUSES[0];
  };

  const getPriorityConfig = (priority: string) => {
    return MAINTENANCE_PRIORITIES.find(p => p.value === priority) || MAINTENANCE_PRIORITIES[0];
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

  if (maintenances.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma manutenção registrada</h3>
          <p className="text-gray-500">Nenhuma ordem de serviço encontrada para este ativo.</p>
        </CardContent>
      </Card>
    );
  }

  // Ordenar por data de início (mais recente primeiro)
  const sortedMaintenances = [...maintenances].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Histórico de Manutenções - {itemName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedMaintenances.map((maintenance) => {
              const typeConfig = getTypeConfig(maintenance.type);
              const statusConfig = getStatusConfig(maintenance.status);
              const priorityConfig = getPriorityConfig(maintenance.priority);
              const overdue = isOverdue(maintenance.endDate, maintenance.status);
              const overdueDays = getOverdueDays(maintenance.endDate);
              
              return (
                <div key={maintenance.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{maintenance.title}</h4>
                      <p className="text-sm text-gray-600">
                        Criado por {maintenance.createdBy} em {new Date(maintenance.createdAt).toLocaleDateString()}
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Data Início</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(maintenance.startDate).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data Prevista Fim</p>
                      <p className={`font-medium flex items-center gap-1 ${overdue ? 'text-red-600' : ''}`}>
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {maintenance.endDate ? new Date(maintenance.endDate).toLocaleString() : 'Não definida'}
                        {overdue && ` (${overdueDays} dias atrasado)`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Custo</p>
                      <p className="font-medium flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        R$ {maintenance.cost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  {maintenance.responsible && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-2">Responsável</p>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{maintenance.responsible}</span>
                        {maintenance.responsibleEmail && (
                          <span className="text-sm text-blue-600">({maintenance.responsibleEmail})</span>
                        )}
                      </div>
                    </div>
                  )}

                  {maintenance.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Descrição</p>
                      <p className="text-sm font-medium">{maintenance.description}</p>
                    </div>
                  )}

                  {maintenance.notes && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Observações</p>
                      <p className="text-sm font-medium">{maintenance.notes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}