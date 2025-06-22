
-- Crear tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Crear función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Tabla para configuración de sueldo fijo
CREATE TABLE public.sueldo_fijo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monto DECIMAL(15,2) NOT NULL,
  moneda TEXT NOT NULL DEFAULT 'ARS',
  fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla para ingresos extras
CREATE TABLE public.ingresos_extras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  monto DECIMAL(15,2) NOT NULL,
  moneda TEXT NOT NULL DEFAULT 'ARS',
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  categoria TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla para egresos
CREATE TABLE public.egresos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  monto DECIMAL(15,2) NOT NULL,
  moneda TEXT NOT NULL DEFAULT 'ARS',
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  categoria TEXT,
  descuento_porcentaje DECIMAL(5,2),
  descuento_moneda TEXT,
  cashback_porcentaje DECIMAL(5,2),
  cashback_moneda TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla para inversiones
CREATE TABLE public.inversiones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  nombre_activo TEXT,
  tipo_inversion TEXT NOT NULL CHECK (tipo_inversion IN ('ticker', 'cantidad')),
  monto_invertido DECIMAL(15,2),
  cantidad_activos DECIMAL(15,8),
  moneda_origen TEXT NOT NULL DEFAULT 'ARS',
  precio_compra DECIMAL(15,8),
  fecha_compra DATE NOT NULL DEFAULT CURRENT_DATE,
  activa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla para cambios de divisa
CREATE TABLE public.cambios_divisa (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monto_origen DECIMAL(15,2) NOT NULL,
  moneda_origen TEXT NOT NULL,
  monto_destino DECIMAL(15,2) NOT NULL,
  moneda_destino TEXT NOT NULL,
  tasa_cambio DECIMAL(15,6) NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo_origen TEXT CHECK (tipo_origen IN ('efectivo', 'inversion')),
  ticker_origen TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sueldo_fijo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingresos_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.egresos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inversiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cambios_divisa ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas de seguridad para sueldo_fijo
CREATE POLICY "Users can view their own sueldo" ON public.sueldo_fijo
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sueldo" ON public.sueldo_fijo
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sueldo" ON public.sueldo_fijo
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sueldo" ON public.sueldo_fijo
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas de seguridad para ingresos_extras
CREATE POLICY "Users can view their own ingresos extras" ON public.ingresos_extras
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own ingresos extras" ON public.ingresos_extras
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ingresos extras" ON public.ingresos_extras
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own ingresos extras" ON public.ingresos_extras
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas de seguridad para egresos
CREATE POLICY "Users can view their own egresos" ON public.egresos
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own egresos" ON public.egresos
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own egresos" ON public.egresos
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own egresos" ON public.egresos
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas de seguridad para inversiones
CREATE POLICY "Users can view their own inversiones" ON public.inversiones
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own inversiones" ON public.inversiones
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own inversiones" ON public.inversiones
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own inversiones" ON public.inversiones
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas de seguridad para cambios_divisa
CREATE POLICY "Users can view their own cambios divisa" ON public.cambios_divisa
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own cambios divisa" ON public.cambios_divisa
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cambios divisa" ON public.cambios_divisa
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own cambios divisa" ON public.cambios_divisa
  FOR DELETE USING (auth.uid() = user_id);
