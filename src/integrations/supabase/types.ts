export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cambios_divisa: {
        Row: {
          created_at: string
          fecha: string
          id: string
          moneda_destino: string
          moneda_origen: string
          monto_destino: number
          monto_origen: number
          notas: string | null
          tasa_cambio: number
          ticker_origen: string | null
          tipo_origen: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          fecha?: string
          id?: string
          moneda_destino: string
          moneda_origen: string
          monto_destino: number
          monto_origen: number
          notas?: string | null
          tasa_cambio: number
          ticker_origen?: string | null
          tipo_origen?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          fecha?: string
          id?: string
          moneda_destino?: string
          moneda_origen?: string
          monto_destino?: number
          monto_origen?: number
          notas?: string | null
          tasa_cambio?: number
          ticker_origen?: string | null
          tipo_origen?: string | null
          user_id?: string
        }
        Relationships: []
      }
      egresos: {
        Row: {
          cashback_moneda: string | null
          cashback_porcentaje: number | null
          categoria: string | null
          created_at: string
          descripcion: string
          descuento_moneda: string | null
          descuento_porcentaje: number | null
          fecha: string
          id: string
          moneda: string
          monto: number
          user_id: string
        }
        Insert: {
          cashback_moneda?: string | null
          cashback_porcentaje?: number | null
          categoria?: string | null
          created_at?: string
          descripcion: string
          descuento_moneda?: string | null
          descuento_porcentaje?: number | null
          fecha?: string
          id?: string
          moneda?: string
          monto: number
          user_id: string
        }
        Update: {
          cashback_moneda?: string | null
          cashback_porcentaje?: number | null
          categoria?: string | null
          created_at?: string
          descripcion?: string
          descuento_moneda?: string | null
          descuento_porcentaje?: number | null
          fecha?: string
          id?: string
          moneda?: string
          monto?: number
          user_id?: string
        }
        Relationships: []
      }
      inflacion: {
        Row: {
          anio: number
          categoria: string
          created_at: string
          descripcion: string | null
          id: string
          mes: number
          porcentaje_inflacion: number
          updated_at: string
          user_id: string
        }
        Insert: {
          anio: number
          categoria: string
          created_at?: string
          descripcion?: string | null
          id?: string
          mes: number
          porcentaje_inflacion: number
          updated_at?: string
          user_id: string
        }
        Update: {
          anio?: number
          categoria?: string
          created_at?: string
          descripcion?: string | null
          id?: string
          mes?: number
          porcentaje_inflacion?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ingresos_extras: {
        Row: {
          categoria: string | null
          created_at: string
          descripcion: string
          fecha: string
          id: string
          moneda: string
          monto: number
          user_id: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          descripcion: string
          fecha?: string
          id?: string
          moneda?: string
          monto: number
          user_id: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          descripcion?: string
          fecha?: string
          id?: string
          moneda?: string
          monto?: number
          user_id?: string
        }
        Relationships: []
      }
      inversiones: {
        Row: {
          activa: boolean
          cantidad_activos: number | null
          created_at: string
          fecha_compra: string
          id: string
          moneda_origen: string
          monto_invertido: number | null
          nombre_activo: string | null
          notas: string | null
          precio_actual: number | null
          precio_compra: number | null
          ticker: string
          tipo_inversion: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activa?: boolean
          cantidad_activos?: number | null
          created_at?: string
          fecha_compra?: string
          id?: string
          moneda_origen?: string
          monto_invertido?: number | null
          nombre_activo?: string | null
          notas?: string | null
          precio_actual?: number | null
          precio_compra?: number | null
          ticker: string
          tipo_inversion: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activa?: boolean
          cantidad_activos?: number | null
          created_at?: string
          fecha_compra?: string
          id?: string
          moneda_origen?: string
          monto_invertido?: number | null
          nombre_activo?: string | null
          notas?: string | null
          precio_actual?: number | null
          precio_compra?: number | null
          ticker?: string
          tipo_inversion?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sueldo_fijo: {
        Row: {
          activo: boolean
          created_at: string
          fecha_inicio: string
          id: string
          moneda: string
          monto: number
          updated_at: string
          user_id: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          fecha_inicio?: string
          id?: string
          moneda?: string
          monto: number
          updated_at?: string
          user_id: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          fecha_inicio?: string
          id?: string
          moneda?: string
          monto?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
