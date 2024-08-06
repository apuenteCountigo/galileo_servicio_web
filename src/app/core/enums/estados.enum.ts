export enum Estados {
  ACTIVO = 2,
  DESACTIVADO = 4,
  PERMANENTE = 6,
  INVITADO = 7,
  OPERATIVA = 8,
  AVERIADA = 9,
  EN_INSTALACION = 10,
  PERDIDA = 11,
  BAJA = 12,
  DISPONIBLE = 18,
}

export enum EstadosBaliza {
  OPERATIVA = 'Operativa',
  AVERIADA = 'En Reparación',
  EN_INSTALACION = 'En Instalación',
  PERDIDA = 'Perdida',
  BAJA = 'Baja',
  DISPONIBLE = 'Disponible en Unidad',
  SIN_INICIALIZAR = 'Sin Inicializar',
  A_RECUPERAR = 'A Recuperar',
  SIN_ASIGNAR = 'Sin Asignar a Unidad',
}

export enum EstadosOperacion {
  ACTIVA = 'Activa',
  FINALIZADA = 'Finalizada',
  DURMIENTE = 'Durmiente',
}

export enum EstadosGeneracionEvidencia {
  INICIADA = 'INICIADA',
  FINALIZADA = 'Finalizada',
  SIN_INICIAR = 'SIN INICIAR',
}

export enum EstadosBalizaDataminer {
  ENCENDIDA = 'Encendida',
  APAGADA = 'Apagada',
  SIN_INICIAR = 'Sin Iniciar',
}

export enum EstadosUser {
  PERMANENTE = 'PERMANENTE',
  INVITADO = 'INVITADO',
}
