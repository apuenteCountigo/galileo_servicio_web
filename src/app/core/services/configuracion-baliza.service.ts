import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionBalizaService {
  constructor(private http: HttpClient) {}

  submitEstadoConfig(body: any): Observable<any> {
    return this.http.post(
      'http://192.168.0.195:8090/api/apis/servicio-apis/balizaConfiguracionLed',
      body
    );
  }
  submitUmbralSonido(body: any): Observable<any> {
    return this.http.post(
      'http://192.168.0.195:8090/api/apis/servicio-apis/balizaUmbralSonido',
      body
    );
  }
  submitNuevoEstado(body: any): Observable<any> {
    return this.http.post(
      'http://192.168.0.195:8090/api/apis/balizaNuevoEstadoConfiguracionLed',
      body
    );
  }
  submitNuevoTemp(body: any): Observable<any> {
    return this.http.post(
      'http://192.168.0.195:8090/api/apis/servicio-apis/balizaNuevoTemporizador',
      body
    );
  }
  submitUmbralSensibilidad(body: any): Observable<any> {
    return this.http.post(
      'http://192.168.0.195:8090/api/apis/servicio-apis/balizaUmbralSensibilidad',
      body
    );
  }

  //CONFGURACION AVANZADA
  getConfiguracionBalizaConfigLed(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_CONFIGURACION_AVANZADA}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  //configuracion LED
  nuevoEstadoConfigLed(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVO_ESTADO_CONFIGURACION_LED}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&estadoConfLed=${body.estadoConfLed}`,
      body
    );
  }
  aplicarNuevoEstadoConfigLed(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_APLICAR_ESTADO_CONFIGURACION_LED}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  obtenerEstadoEnvioConfigLed(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_ESTADO_ENVIO_CONFIG_LED}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  //Umbral de sensibilidad
  nuevoUmbralSensibilidad(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVO_UMBRAL_SENSIBILIDAD}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&valor=${body.valor}`,
      body
    );
  }
  aplicarUmbralSensibilidad(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_APLICAR_UMBRAL_SENSIBILIDAD}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  obtenerEstadoEnvioUmbralSensibilidad(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_ESTADO_ENVIO_UMBRAL_SENSIBILIDAD}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  //Detector sonido
  nuevoEstadoDetectorSonido(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVO_ESTADO_DETECTOR_SONIDO}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&estadoDetecSoni=${body.estadoDetecSoni}`,
      body
    );
  }
  aplicarEstadoDetectorSonido(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_APLICAR_ESTADO_DETECTOR_SONIDO}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  obtenerEstadoEnvioDetectorSonido(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_ESTADO_ENVIO_DETECTOR_SONIDO}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  //Temporizador
  nuevoTemporizador(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVO_TEMPORIZADOR}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&valor_temporizador=${body.valor_temporizador}`,
      body
    );
  }
  aplicarTemporizador(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_APLICAR_TEMPORIZADOR}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  obtenerEstadoEnvioModemTemporizador(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_ESTADO_ENVIO_MODEM_TEMPORIZADOR}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  //Alarma pais
  aplicarConfigPais(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_APLICAR_CONFIG_ALAMRA_PAIS}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&confAlarmaPais=${body.confAlarmaPais}`,
      body
    );
  }
  obtenerEstadoConfigPais(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_ESTADO_ENVIO_CONFIG_LED}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  //Nuevo voltaje apagado
  aplicarNuevoVoltajeApagado(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_APLICAR_CONFIG_NUEVO_VOLTAJE_APAGADO}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&nuevoVoltApag=${body.nuevoVoltApag}`,
      body
    );
  }
  //Nuevo voltaje encendido
  aplicarNuevoVoltajeEncendido(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_APLICAR_CONFIG_NUEVO_VOLTAJE_ENCENDIDO}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&nuevoVoltEncen=${body.nuevoVoltEncen}`,
      body
    );
  }
  aplicarUmbralUPS(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_APLICAR_CONFIG_NUEVO_UMBRAL_UPS}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  obtenerEstadoEnvioUmbralUPS(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_ESTADO_ENVIO_UMBRAL_UPS}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  //DETECTOR DE SONIDO

  //CONFIGURACION ULTIM POSICION
  getConfiguracionBalizaUtimaPosicion(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_ULTIMA_POSICION}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }

  //CONFIGURACION GPS
  getConfiguracionBalizaGPS(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_CONFIGURACION_GPS}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  nuevaConfiguracionBalizaGPS(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVA_CONFIGURACION_GPS}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&valorGps=${body.valorGps}`,
      body
    );
  }
  nuevaConfiguracionTiempoAdqBaliza(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVO_TIEMPO_ADQISICION_BALIZA}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&valorTiempAdquisMov=${body.valorTiempAdquisMov}`,
      body
    );
  }
  nuevaConfiguracionTiempoAdqEstacionBaliza(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVO_TIEMPO_ADQISICION_ESTACION_BALIZA}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&valorTiempAdquisEst=${body.valorTiempAdquisEst}`,
      body
    );
  }
  nuevaConfiguracionTiempoPreAdqBaliza(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVO_TIEMPO_PRE_ADQUISICION_BALIZA}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&valorTiempPreAdquis=${body.valorTiempPreAdquis}`,
      body
    );
  }
  aplicarConfiguracionBalizaGPS(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_APLICAR_CONFIGURACION_BALIZA}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  obtenerEstadoPeticionGPS(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_ESTADO_CONFIGURACION_GPS}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }

  nuevaConfiguracionGPSLive(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVO_CONFIGURACION_GPS_LIVE}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&valorNuevaConfigGpsLive=${body.valorNuevaConfigGpsLive}`,
      body
    );
  }
  nuevaConfiguracionIntervaloDescargaBaliza(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVO_INTERVALO_DESCARGA_BALIZA}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&valorIntervaloMin=${body.valorIntervaloMin}`,
      body
    );
  }
  aplicarConfiguracionGPSLive(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_APLICAR_CONFIGURACION_GPS_LIVE}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  obtenerEstadoPeticionGPSLive(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_CONFIGURACION_GPS_LIVE}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }

  nuevaConfiguracionEstadoReceptorGlonass(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVO_ESTADO_RECEPTOR_GLONASS}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&valorRecepGlonass=${body.valorRecepGlonass}`,
      body
    );
  }
  aplicarConfiguracionGlonass(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_APLICAR_CONFIGURACION_GLONASS}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  obtenerEstadoPeticionGlonass(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_CONFIGURACION_GLONASS}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  //CONFIGURACION GPS

  //CONFIGURACION ALRTAS OPERATIVAS
  getConfiguracionAlertasOperativa(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_ALERTA_OPERATIVA}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  aplicarEmailAvisoBateria(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVA_EMAIL_AVISO_CARGA_BATERIA}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&emailCargaBateria=${body.emailCargaBateria}`,
      body
    );
  }
  aplicarEmailInicioMovimiento(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVA_EMAIL_AVISO_INICIO_MOVIMIENTO}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&emailAvisoInicioMov=${body.emailAvisoInicioMov}`,
      body
    );
  }
  aplicarEmailFinMovimiento(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVA_EMAIL_AVISO_FIN_MOVIMIENTO}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&emailAvisoFinMovi=${body.emailAvisoFinMovi}`,
      body
    );
  }
  aplicarEmailAvisoEntradaGeocerca(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVA_EMAIL_AVISO_ENTRADA_GEOCERCA}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&emailAvisoEntraGeo=${body.emailAvisoEntraGeo}`,
      body
    );
  }
  aplicarEmailAvisoSalidaGeocerca(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVA_EMAIL_AVISO_SALIDA_GEOCERCA}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&emailAvisoSalGeo=${body.emailAvisoSalGeo}`,
      body
    );
  }
  aplicarEmailAvisoCambioPais(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVA_EMAIL_AVISO_CAMBIO_DE_PAIS}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&emailAvisoCambioPais=${body.emailAvisoCambioPais}`,
      body
    );
  }
  aplicarTelAvisoCargaBateria(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVA_TELEFONO_AVISO_CARGA_BATERIA}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&telefAvisoCargaBat=${body.telefAvisoCargaBat}`,
      body
    );
  }
  aplicarTelAvisoInicioMovimiento(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVA_TELEFONO_AVISO_INICIO_MOVIMIENTO}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&telefAvisoInicioMov=${body.telefAvisoInicioMov}`,
      body
    );
  }
  aplicarTelAvisoFinMovimiento(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVA_TELEFONO_AVISO_FIN_MOVIMIENTO}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&telefAvisoFinMov=${body.telefAvisoFinMov}`,
      body
    );
  }
  aplicarTelAvisoEntradaGeocerca(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVA_TELEFONO_AVISO_ENTRADA_GEOCERCA}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&telefAvisoEntrGeoc=${body.telefAvisoEntrGeoc}`,
      body
    );
  }
  aplicarTelAvisoSalidaGeocerca(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVA_TELEFONO_AVISO_SALIDA_GEOCERCA}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&telefAvisoSalGeoc=${body.telefAvisoSalGeoc}`,
      body
    );
  }
  aplicarTelAvisoCambioPais(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVA_TELEFONO_AVISO_CAMBIO_DE_PAIS}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&telefAvisoCambPais=${body.telefAvisoCambPais}`,
      body
    );
  }

  //CONFIGURACION AANTI BARRIDOS
  getConfiguracionAntiBarridos(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_ANTI_BARRIDOS}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  nuevaConfiguracionEstadoAntiBarrido(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVO_ESTADO_ANTI_BARRIDOS}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&nuevoEstadoAntiBarrido=${body.nuevoEstadoAntiBarrido}`,
      body
    );
  }
  nuevaConfiguracionFechaInicioAntiBarrido(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_FECHA_INICIO_ANTI_BARRIDOS}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&nuevaFechaIniAntiBarrido=${body.nuevaFechaIniAntiBarrido}`,
      body
    );
  }
  nuevaConfiguracionFechaFinAntiBarrido(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_FECHA_FIN_ANTI_BARRIDOS}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&nuevaFechaFinAntiBarrido=${body.nuevaFechaFinAntiBarrido}`,
      body
    );
  }
  aplicarAntiBarrido(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_APLICAR_ANTI_BARRIDOS}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  obtenerEstadoPeticionAntiBarrido(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_ESTADO_ENVIO_ANTI_BARRIDO}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }

  //iInstalacion
  getConfiguracionInstalacionBaliza(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_CONFIG_INSTALACION_BALIZA}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  aplicarEstadoBaliza(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_APLICAR_ESTADO_BALIZA}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&estadoBaliza=${body.estadoBaliza}`,
      body
    );
  }
  aplicarFechaInicioInstalacion(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_APLICAR_FECHA_INICIO_INSTALACION}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&fechaInicInstalac=${body.fechaInicInstalac}`,
      body
    );
  }

  aplicarFechaFinAutorizacion(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_APLICAR_FECHA_FIN_AUTORIZACION}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&fechaFinAutorizacion=${body.fechaFinAutorizacion}`,
      body
    );
  }

  aplicarCargaBateriaInstalada(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_APLICAR_CARGA_BATERIA_INSTALADA}?idDataminer=${body.idDataminer}&idElement=${body.idElement}&cargaBatInst=${body.cargaBatInst}`,
      body
    );
  }
  obtenerEstadoPeticionIFechaInicioInstalacion(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_ESTADO_FECHA_INICIO_INSTALACION}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }

  //Planificador
  getConfiguracionPlaniicador(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_CONFIG_PLANIFICADOR}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  getConfiguracionNuevoPlaniicador(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_CONFIG_NUEVO_PLANIFICADOR}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  nuevaConfiguracionPlanificadorCelda(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_NUEVO_PLANIFICADOR_CELDA}`,
      body
    );
  }
  aplicarConfiguracionPlanificador(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_APLICAR_PLANIFICADOR}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
  obtenerEstadoEnvioNuevoPlanificador(body: any): Observable<any> {
    return this.http.post(
      `${environment.API_URL_OBTENER_ESTADO_NUEVO_PLANIFICADOR}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }

  //Saber si la baliza esta encendida
  isBalizaOn(body: any): Observable<any> {
    return this.http.post(
      `${environment.IS_BALIZA_ON}?idDataminer=${body.idDataminer}&idElement=${body.idElement}`,
      body
    );
  }
}
