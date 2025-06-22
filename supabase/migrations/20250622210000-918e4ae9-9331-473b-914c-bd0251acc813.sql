
-- Crear tabla para datos de inflación
CREATE TABLE public.inflacion (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  anio INTEGER NOT NULL CHECK (anio >= 1900),
  categoria TEXT NOT NULL,
  porcentaje_inflacion DECIMAL(8,4) NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Evitar duplicados por usuario, mes, año y categoría
  UNIQUE(user_id, mes, anio, categoria)
);

-- Habilitar Row Level Security
ALTER TABLE public.inflacion ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para inflación
CREATE POLICY "Users can view their own inflacion data" ON public.inflacion
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own inflacion data" ON public.inflacion
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own inflacion data" ON public.inflacion
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own inflacion data" ON public.inflacion
  FOR DELETE USING (auth.uid() = user_id);

-- Índices para mejorar performance en consultas por fecha y categoría
CREATE INDEX idx_inflacion_user_date ON public.inflacion(user_id, anio, mes);
CREATE INDEX idx_inflacion_categoria ON public.inflacion(user_id, categoria);
