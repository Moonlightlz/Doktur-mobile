import type { Esquemas } from '../api/cliente';

type EstadoCita = Esquemas['CitaDto']['estado'];
type Servicio = Esquemas['CitaDto']['servicio'];
type Desenlace = NonNullable<Esquemas['AtencionRespuestaDto']['desenlace']>;

export type Tono = 'marca' | 'aviso' | 'exito' | 'alerta' | 'informacion' | 'neutro';

export const ESTADO_CITA: Record<EstadoCita, { texto: string; tono: Tono }> = {
	programada: { texto: 'Programada', tono: 'marca' },
	en_curso: { texto: 'En curso', tono: 'aviso' },
	finalizada: { texto: 'Finalizada', tono: 'exito' },
	cancelada: { texto: 'Cancelada', tono: 'neutro' },
	no_asistio: { texto: 'No asistió', tono: 'neutro' },
};

export const SERVICIO: Record<Servicio, string> = {
	teleorientacion: 'Teleorientación',
	teleconsulta: 'Teleconsulta',
};

export const DESENLACE: Record<Desenlace, string> = {
	alta: 'Alta',
	seguimiento: 'Seguimiento',
	derivacion_programada: 'Derivación programada',
	derivacion_urgente: 'Derivación urgente',
};

export const NIVEL_IDENTIDAD = {
	N0: 'Sin identificar',
	N1: 'Identidad declarada',
	N2: 'Identidad verificada por la IPRESS',
} as const;

export const ROL = {
	paciente: 'Paciente',
	medico: 'Médico',
	coordinador: 'Coordinación IPRESS',
	verificador: 'Verificación',
	operaciones: 'Operaciones',
	auditor: 'Auditoría',
	superadmin: 'Administración',
} as const;
