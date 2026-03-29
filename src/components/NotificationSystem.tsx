"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Package, CheckCircle, X } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface Notification {
  id: string;
  type: 'warranty' | 'stock' | 'loan' | 'maintenance';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  itemId?: string;
  itemName?: string;
  days?: number;
  timestamp: Date;
  read: boolean;
}

interface NotificationSystemProps {
  items: any[];
  supplies: any[];
  movements: any[];
  maintenances: any[];
  onDismiss?: (id: string) => void;
}

export function NotificationSystem({ 
  items, 
  supplies, 
  movements, 
  maintenances, 
  onDismiss 
}: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: Notification[] = [];

      // Notificações de garantia próxima de expirar
      const warrantyNotifications = items.filter(item => 
        item.warrantyExpiry && 
        new Date(item.warrantyExpiry).getTime() - new Date().getTime() < 90 * 24 * 60 * 60 * 1000 &&
        new Date(item.warrantyExpiry).getTime() - new Date().getTime() > 0
      ).map(item => {
        const days = Math.ceil((new Date(item.warrantyExpiry).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        return {
          id: `warranty-${item.id}`,
          type: 'warranty' as const,
          title: 'Garantia Próxima de Expirar',
          message: `${item.name} - ${item.manufacturer} ${item.model}`,
          severity: days <= 30 ? 'high' : 'medium',
          itemId: item.id,
          itemName: item.name,
          days,
          timestamp: new Date(),
          read: false
        };
      });

      // Notificações de estoque mínimo
      const stockNotifications = supplies.filter(supply => 
        supply.quantity <= supply.minStock && supply.quantity > 0
      ).map(supply => ({
        id: `stock-${supply.id}`,
        type: 'stock' as const,
        title: 'Estoque Mínimo Atingido',
        message: `${supply.name} - ${supply.quantity} ${supply.unit} restantes`,
        severity: 'medium',
        itemId: supply.id,
        itemName: supply.name,
        timestamp: new Date(),
        read: false
      }));

      // Notificações de empréstimos atrasados
      const loanNotifications = movements.filter(movement => 
        movement.type === 'loan' && 
        movement.returnDate && 
        new Date(movement.returnDate) < new Date()
      ).map(movement => ({
        id: `loan-${movement.id}`,
        type: 'loan' as const,
        title: 'Empréstimo Atrasado',
        message: `${movement.recipient} - ${movement.reason}`,
        severity: 'high',
        itemId: movement.itemId,
        timestamp: new Date(movement.returnDate),
        read: false
      }));

      // Notificações de manutenções em andamento
      const maintenanceNotifications = maintenances.filter(maintenance => 
        maintenance.status === 'in_progress'
      ).map(maintenance => ({
        id: `maintenance-${maintenance.id}`,
        type: 'maintenance' as const,
        title: 'Manutenção em Andamento',
        message: `${maintenance.title} - ${maintenance.responsible}`,
        severity: 'medium',
        itemId: maintenance.itemId,
        timestamp: new Date(maintenance.startDate),
        read: false
      }));

      setNotifications([
        ...warrantyNotifications,
        ...stockNotifications,
        ...loanNotifications,
        ...maintenanceNotifications
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    };

    generateNotifications();
  }, [items, supplies, movements, maintenances]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    onDismiss?.(id);
    showSuccess('Notificação descartada');
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warranty': return <Clock className="h-4 w-4" />;
      case 'stock': return <Package className="h-4 w-4" />;
      case 'loan': return <AlertTriangle className="h-4 w-4" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Botão de notificações */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative"
        >
          <AlertTriangle className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Painel de notificações */}
      {showNotifications && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setShowNotifications(false)}>
          <div 
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Notificações</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(100vh-80px)]">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {notifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={`border-l-4 ${getSeverityColor(notification.severity)} ${!notification.read ? 'bg-opacity-50' : ''}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(notification.type)}
                            <CardTitle className="text-sm">{notification.title}</CardTitle>
                          </div>
                          <div className="flex gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-6 w-6 p-0"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => dismissNotification(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        {notification.days && (
                          <p className="text-xs text-gray-500">
                            Expira em {notification.days} dia(s)
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          {notification.timestamp.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}