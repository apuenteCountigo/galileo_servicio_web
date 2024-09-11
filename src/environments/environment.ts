// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const BASE_WS = 'ws://192.168.0.98:8090/ws';
const BASE_API = 'http://192.168.0.98:8090/api/';
const BASE_API_APIS = 'http://192.168.0.98:8090/api/apis/';

//const BASE_API = 'http://80.84.132.104:8090/api/';

export const environment = {
  production: false,
  WS_URL: BASE_WS,
  API_URL: BASE_API,
  API_URL_USUARIO: BASE_API + 'usuarios',
  API_URL_UNIDAD: BASE_API + 'unidades',
  API_URL_UNIDAD_USUARIO_RELATION: BASE_API + 'unidades-usuarios',
  API_URL_OPERACION: BASE_API + 'operaciones',
  API_URL_OBJETIVOS: BASE_API + 'objetivos',
  API_URL_PERMISOS: BASE_API + 'permisos',
  API_URL_ESTADO: BASE_API + 'estados',
  API_URL_EMPLEO: BASE_API + 'empleos',
  API_URL_JUZGADO: BASE_API + 'juzgados',
  API_URL_MODELOSBALIZAS: BASE_API + 'modelosbalizas',
  API_URL_PERFIL: BASE_API + 'perfiles',
  API_URL_LOGIN: BASE_API + 'security/oauth/token',
  API_URL_IMPORTAR: BASE_API + 'importador/importarExcel',
  API_URL_PROV: BASE_API + 'provincias',
  API_URL_BALIZA: BASE_API + 'balizas',
  API_URL_HISTORICO: BASE_API + 'histobjbal',
  API_URL_SERVIDORES: BASE_API + 'conexiones',
  API_URL_TIPO_BALIZA: BASE_API + 'tipobalizas',
  API_URL_TIPO_CONTRATO: BASE_API + 'tiposcontratos',
  API_URL_TRACCAR: BASE_API + 'apis/mostrarMapaTraccar',
  API_URL_TRAZAS: BASE_API + 'trazabilidad',
  API_URL_EVIDENCIAS: BASE_API + 'evidencias',
  API_URL_GEOCERCA: BASE_API + 'geocercas',
  API_URL_DATAMINER_LIMIT_ELEMENTS:
    BASE_API_APIS + 'obtenerLimiteElementosDataMiner',

  //CONFIGURACION DE BALIZAS//
  //**********Configuracion avanzada*********** //
  API_URL_OBTENER_CONFIGURACION_AVANZADA:
    BASE_API_APIS + 'obtenerParametrosAvanzadosBaliza',
  API_URL_NUEVO_ESTADO_CONFIGURACION_LED:
    BASE_API_APIS + 'nuevoEstadoConfiguracionLED',
  API_URL_APLICAR_ESTADO_CONFIGURACION_LED:
    BASE_API_APIS + 'aplicarConfiguracionLed',
  API_URL_OBTENER_ESTADO_CONFIGURACION_LED:
    BASE_API_APIS + 'obtenerEstadoEnvioConfiguraciónLED',
  API_URL_NUEVO_UMBRAL_SENSIBILIDAD: BASE_API_APIS + 'nuevoUmbralSensibilidad',
  API_URL_APLICAR_UMBRAL_SENSIBILIDAD:
    BASE_API_APIS + 'aplicarUmbralSensibilidad',
  API_URL_NUEVO_ESTADO_DETECTOR_SONIDO:
    BASE_API_APIS + 'nuevoEstadoDetectorSonido',
  API_URL_APLICAR_ESTADO_DETECTOR_SONIDO:
    BASE_API_APIS + 'aplicarDetectorSonido',
  API_URL_NUEVO_TEMPORIZADOR: BASE_API_APIS + 'nuevoTemporalizadorSegundos',
  API_URL_APLICAR_TEMPORIZADOR: BASE_API_APIS + 'aplicarModemTemporizador',
  API_URL_APLICAR_CONFIG_ALAMRA_PAIS: BASE_API_APIS + 'confAlarmaPais',
  API_URL_APLICAR_CONFIG_NUEVO_VOLTAJE_APAGADO: BASE_API_APIS + 'nuevoVoltApag',
  API_URL_APLICAR_CONFIG_NUEVO_VOLTAJE_ENCENDIDO:
    BASE_API_APIS + 'nuevoVoltEncen',
  API_URL_APLICAR_CONFIG_NUEVO_UMBRAL_UPS: BASE_API_APIS + 'aplicarUmbralUPS',

  API_URL_OBTENER_ESTADO_ENVIO_CONFIG_LED:
    BASE_API_APIS + 'obtenerEstadoEnvioConfiguracionLED',
  API_URL_OBTENER_ESTADO_ENVIO_UMBRAL_SENSIBILIDAD:
    BASE_API_APIS + 'estadoEnvioUmbralSensibilidad',
  API_URL_OBTENER_ESTADO_ENVIO_DETECTOR_SONIDO:
    BASE_API_APIS + 'estadoEnvioDetectorSonido',
  API_URL_OBTENER_ESTADO_ENVIO_MODEM_TEMPORIZADOR:
    BASE_API_APIS + 'estadoEnvioModemTemporizador',
  API_URL_OBTENER_ESTADO_ENVIO_ANTI_BARRIDO:
    BASE_API_APIS + 'obtenerEstEnvioAntibarrido',
  API_URL_OBTENER_ESTADO_ENVIO_UMBRAL_UPS:
    BASE_API_APIS + 'obtenerEstEnvioUmbralUPS',

  //**********Configuracion ultima posicion*********** //
  API_URL_ULTIMA_POSICION: BASE_API_APIS + 'obtenerUltimaPosicionBaliza',
  //**********Configuracion GPS*********** //
  API_URL_OBTENER_CONFIGURACION_GPS:
    BASE_API_APIS + 'obtenerParamConfigGpsBaliza',
  API_URL_NUEVA_CONFIGURACION_GPS:
    BASE_API_APIS + 'nuevaConfiguracionGpsBaliza',
  API_URL_NUEVO_TIEMPO_ADQISICION_BALIZA:
    BASE_API_APIS + 'nuevoTiempoAdquisMovBaliza',
  API_URL_NUEVO_TIEMPO_ADQISICION_ESTACION_BALIZA:
    BASE_API_APIS + 'nuevoTiempoAdquisEstacioBaliza',
  API_URL_NUEVO_TIEMPO_PRE_ADQUISICION_BALIZA:
    BASE_API_APIS + 'nuevoTiempoPreAdquisBaliza',
  API_URL_APLICAR_CONFIGURACION_BALIZA:
    BASE_API_APIS + 'aplicarConfiguracionGps',
  API_URL_OBTENER_ESTADO_CONFIGURACION_GPS:
    BASE_API_APIS + 'obtenerEstEnvioConfGPS',

  API_URL_NUEVO_CONFIGURACION_GPS_LIVE:
    BASE_API_APIS + 'nuevaConfiguracionGPSLive',
  API_URL_NUEVO_INTERVALO_DESCARGA_BALIZA:
    BASE_API_APIS + 'nuevoIntervaloDescargaBaliza',
  API_URL_APLICAR_CONFIGURACION_GPS_LIVE:
    BASE_API_APIS + 'aplicarConfiguracionGPSLive',
  API_URL_OBTENER_CONFIGURACION_GPS_LIVE:
    BASE_API_APIS + 'obtenerEstEnvioConfigGPSLive',

  API_URL_NUEVO_ESTADO_RECEPTOR_GLONASS:
    BASE_API_APIS + 'nuevoEstadoReceptorGlonass',
  API_URL_APLICAR_CONFIGURACION_GLONASS:
    BASE_API_APIS + 'aplicarConfiguracionGlonass',
  API_URL_OBTENER_CONFIGURACION_GLONASS:
    BASE_API_APIS + 'obtenerEstadoEnvioConfigGlonass',
  //************************Alertas Opertivas*********************//
  API_URL_OBTENER_ALERTA_OPERATIVA:
    BASE_API_APIS + 'obtenerParamConfigAlertasOperBaliza',
  API_URL_NUEVA_EMAIL_AVISO_CARGA_BATERIA:
    BASE_API_APIS + 'emailAvisoCargaBateria',
  API_URL_NUEVA_EMAIL_AVISO_INICIO_MOVIMIENTO:
    BASE_API_APIS + 'emailAvisoInicioMov',
  API_URL_NUEVA_EMAIL_AVISO_FIN_MOVIMIENTO: BASE_API_APIS + 'emailAvisoFinMovi',
  API_URL_NUEVA_EMAIL_AVISO_ENTRADA_GEOCERCA:
    BASE_API_APIS + 'emailAvisoEntraGeo',
  API_URL_NUEVA_EMAIL_AVISO_SALIDA_GEOCERCA: BASE_API_APIS + 'emailAvisoSalGeo',
  API_URL_NUEVA_EMAIL_AVISO_CAMBIO_DE_PAIS:
    BASE_API_APIS + 'emailAvisoCambioPais',
  API_URL_NUEVA_TELEFONO_AVISO_CARGA_BATERIA:
    BASE_API_APIS + 'telefAvisoCargaBat',
  API_URL_NUEVA_TELEFONO_AVISO_INICIO_MOVIMIENTO:
    BASE_API_APIS + 'telefAvisoInicioMov',
  API_URL_NUEVA_TELEFONO_AVISO_FIN_MOVIMIENTO:
    BASE_API_APIS + 'telefAvisoFinMov',
  API_URL_NUEVA_TELEFONO_AVISO_ENTRADA_GEOCERCA:
    BASE_API_APIS + 'telefAvisoEntrGeoc',
  API_URL_NUEVA_TELEFONO_AVISO_SALIDA_GEOCERCA:
    BASE_API_APIS + 'telefAvisoSalGeoc',
  API_URL_NUEVA_TELEFONO_AVISO_CAMBIO_DE_PAIS:
    BASE_API_APIS + 'telefAvisoCambPais',

  //************************Anti Barridos*********************//
  API_URL_OBTENER_ANTI_BARRIDOS:
    BASE_API_APIS + 'obtenerParamConfigAntiBarridosBaliza',
  API_URL_NUEVO_ESTADO_ANTI_BARRIDOS: BASE_API_APIS + 'nuevoEstadoAntiBarrido',
  API_URL_FECHA_INICIO_ANTI_BARRIDOS:
    BASE_API_APIS + 'nuevaFechaIniAntiBarrido',
  API_URL_FECHA_FIN_ANTI_BARRIDOS: BASE_API_APIS + 'nuevaFechaFinAntiBarrido',
  API_URL_APLICAR_ANTI_BARRIDOS: BASE_API_APIS + 'aplicarConfAntiBarrido',

  //************************Instlacion*************************//
  API_URL_OBTENER_CONFIG_INSTALACION_BALIZA:
    BASE_API_APIS + 'obtenerParamConfigInstalacBaliza',
  API_URL_APLICAR_ESTADO_BALIZA: BASE_API_APIS + 'estadoBaliza',
  API_URL_APLICAR_FECHA_INICIO_INSTALACION: BASE_API_APIS + 'fechaInicInstalac',
  API_URL_APLICAR_FECHA_FIN_AUTORIZACION:
    BASE_API_APIS + 'fechaFinAutorizacion',
  API_URL_APLICAR_CARGA_BATERIA_INSTALADA: BASE_API_APIS + 'cargaBatInst',
  API_URL_OBTENER_ESTADO_FECHA_INICIO_INSTALACION:
    BASE_API_APIS + 'obtenerEstEnvioFecInst',

  //*************************Planificador*********************************//
  API_URL_OBTENER_CONFIG_PLANIFICADOR: BASE_API_APIS + 'obtenerTabPlanifAct',
  API_URL_OBTENER_CONFIG_NUEVO_PLANIFICADOR:
    BASE_API_APIS + 'obtenerTabPlanifNueva',
  API_URL_NUEVO_PLANIFICADOR_CELDA: BASE_API_APIS + 'enviarConfPlanificador',
  API_URL_APLICAR_PLANIFICADOR: BASE_API_APIS + 'aplicarConfigPlanificador',
  API_URL_OBTENER_ESTADO_NUEVO_PLANIFICADOR:
    BASE_API_APIS + 'obtenerEstEnvPlanif',

  //*******************************IsBalizaOn************************************//
  IS_BALIZA_ON: BASE_API_APIS + 'obtenerEstadoBaliza',

  OAUTH_ID: 'frontendapp',
  OAUTH_SECRET: '12345',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
