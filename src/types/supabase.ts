export interface Database {
  public: {
    Tables: {
      inventory_items: {
        Row: {
          id: string
          name: string
          category: string
          type: 'hardware' | 'software' | 'peripheral' | 'component' | 'supply'
          manufacturer: string
          model: string
          specifications: string
          serial_number: string
          acquisition_date: string
          warranty_expiry: string | null
          location: string
          status: 'available' | 'allocated' | 'maintenance' | 'discarded'
          supplier: string
          invoice_number: string
          value: number
          assigned_to: string | null
          assigned_date: string | null
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          type: 'hardware' | 'software' | 'peripheral' | 'component' | 'supply'
          manufacturer: string
          model: string
          specifications: string
          serial_number: string
          acquisition_date: string
          warranty_expiry?: string | null
          location: string
          status: 'available' | 'allocated' | 'maintenance' | 'discarded'
          supplier: string
          invoice_number: string
          value: number
          assigned_to?: string | null
          assigned_date?: string | null
          notes: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          type?: 'hardware' | 'software' | 'peripheral' | 'component' | 'supply'
          manufacturer?: string
          model?: string
          specifications?: string
          serial_number?: string
          acquisition_date?: string
          warranty_expiry?: string | null
          location?: string
          status?: 'available' | 'allocated' | 'maintenance' | 'discarded'
          supplier?: string
          invoice_number?: string
          value?: number
          assigned_to?: string | null
          assigned_date?: string | null
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      inventory_movements: {
        Row: {
          id: string
          item_id: string
          type: 'entry' | 'exit' | 'loan' | 'return' | 'maintenance' | 'discard'
          quantity: number
          reason: string
          date: string
          user: string
          recipient: string | null
          return_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          type: 'entry' | 'exit' | 'loan' | 'return' | 'maintenance' | 'discard'
          quantity: number
          reason: string
          date: string
          user: string
          recipient?: string | null
          return_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          type?: 'entry' | 'exit' | 'loan' | 'return' | 'maintenance' | 'discard'
          quantity?: number
          reason?: string
          date?: string
          user?: string
          recipient?: string | null
          return_date?: string | null
          created_at?: string
        }
      }
      software_licenses: {
        Row: {
          id: string
          name: string
          version: string
          key: string
          quantity: number
          used_quantity: number
          expiry_date: string | null
          assigned_to: string[]
          supplier: string
          value: number
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          version: string
          key: string
          quantity: number
          used_quantity: number
          expiry_date?: string | null
          assigned_to: string[]
          supplier: string
          value: number
          notes: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          version?: string
          key?: string
          quantity?: number
          used_quantity?: number
          expiry_date?: string | null
          assigned_to?: string[]
          supplier?: string
          value?: number
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      maintenance_contracts: {
        Row: {
          id: string
          equipment_id: string
          provider: string
          start_date: string
          end_date: string
          service_level: string
          cost: number
          status: 'active' | 'expired' | 'cancelled'
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          provider: string
          start_date: string
          end_date: string
          service_level: string
          cost: number
          status: 'active' | 'expired' | 'cancelled'
          notes: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          provider?: string
          start_date?: string
          end_date?: string
          service_level?: string
          cost?: number
          status?: 'active' | 'expired' | 'cancelled'
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}