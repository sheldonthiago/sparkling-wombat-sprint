"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CATEGORIES, UNITS, STATUSES } from '@/types/inventory';

const inventorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  type: z.enum(['hardware', 'software', 'peripheral', 'component', 'supply']),
  manufacturer: z.string().min(1, 'Fabricante é obrigatório'),
  model: z.string().min(1, 'Modelo é obrigatório'),
  specifications: z.string(),
  serialNumber: z.string().min(1, 'Número de série é obrigatório'),
  acquisitionDate: z.string().min(1, 'Data de aquisição é obrigatória'),
  warrantyExpiry: z.string().optional(),
  location: z.string().min(1, 'Localização é obrigatória'),
  status: z.enum(['available', 'allocated', 'maintenance', 'discarded']),
  supplier: z.string().min(1, 'Fornecedor é obrigatório'),
  invoiceNumber: z.string().min(1, 'Número da nota fiscal é obrigatório'),
  value: z.number().min(0, 'Valor deve ser maior ou igual a 0'),
  assignedTo: z.string().optional(),
  notes: z.string(),
});

type InventoryFormData = z.infer<typeof inventorySchema>;

interface InventoryFormProps {
  onSubmit: (data: InventoryFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<InventoryFormData>;
}

export function InventoryForm({ onSubmit, onCancel, initialData }: InventoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || '',
      type: initialData?.type || 'hardware',
      manufacturer: initialData?.manufacturer || '',
      model: initialData?.model || '',
      specifications: initialData?.specifications || '',
      serialNumber: initialData?.serialNumber || '',
      acquisitionDate: initialData?.acquisitionDate ? new Date(initialData.acquisitionDate).toISOString().split('T')[0] : '',
      warrantyExpiry: initialData?.warrantyExpiry ? new Date(initialData.warrantyExpiry).toISOString().split('T')[0] : '',
      location: initialData?.location || '',
      status: initialData?.status || 'available',
      supplier: initialData?.supplier || '',
      invoiceNumber: initialData?.invoiceNumber || '',
      value: initialData?.value || 0,
      assignedTo: initialData?.assignedTo || '',
      notes: initialData?.notes || '',
    },
  });

  const handleSubmit = async (data: InventoryFormData) => {
    setIsSubmitting(true);
    try {
      onSubmit({
        ...data,
        acquisitionDate: new Date(data.acquisitionDate),
        warrantyExpiry: data.warrantyExpiry ? new Date(data.warrantyExpiry) : null,
      });
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? 'Editar Item' : 'Adicionar Novo Item'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Item</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Dell Latitude 5420" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hardware">Hardware</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="peripheral">Periférico</SelectItem>
                        <SelectItem value="component">Componente</SelectItem>
                        <SelectItem value="supply">Suprimento</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fabricante</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Dell, HP, Lenovo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Latitude 5420, EliteBook 840" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Série</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 1ABC234XYZ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acquisitionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Aquisição</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warrantyExpiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validade da Garantia</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Sala 201, Rack A-3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Dell, TechData" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nota Fiscal</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: NF-2024-001234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alocado para</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: João Silva, TI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especificações Técnicas</FormLabel>
                  <FormControl>
                    <textarea 
                      className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md"
                      placeholder="Ex: Intel i7-1165G7, 16GB RAM, 512GB SSD, 14''"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <textarea 
                      className="w-full min-h-[80px] p-3 border border-gray-300 rounded-md"
                      placeholder="Observações adicionais..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : initialData ? 'Atualizar' : 'Adicionar'}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}