-- Migration: Add deactivation fields to tecnicos table
-- Run this in Supabase SQL Editor

-- Add new columns to tecnicos table
ALTER TABLE tecnicos 
ADD COLUMN IF NOT EXISTS fecha_desactivacion TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS fecha_reactivacion TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS motivo_desactivacion TEXT;

-- Add comment for documentation
COMMENT ON COLUMN tecnicos.fecha_desactivacion IS 'Fecha cuando el técnico fue desactivado';
COMMENT ON COLUMN tecnicos.fecha_reactivacion IS 'Fecha cuando el técnico fue reactivado (null si nunca fue reactivado)';
COMMENT ON COLUMN tecnicos.motivo_desactivacion IS 'Motivo de la desactivación: Renuncia, Despido, Vacaciones largas, Otro';
