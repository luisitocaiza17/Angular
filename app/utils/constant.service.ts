import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';

@Injectable()
export class ConstantService {

  API_ENDPOINT: String;
  AUTH_ENDPOINT: String;
  BASE_REF: String;
  URL_TRACKING_CONTRATOS: String;
  URL_HISTORIAL: String;
  ID_GOOGLE_ANALITICS: String;
  CLIENT_ID: String;

  CODIGO_PLATAFORMA: String;
  CODIGO_APLICACION: String;
  URL_CATALOGO_APLICACION_PLATAFORMA: String;

  PUSH_MENSAJE_ODA: string;
  PUSH_TITULO_ODA: string;
  PUSH_CATEGORIA_ODA: number;
  PUSH_APLICACION_ID_ODA: string;
  API_CORPORATIVO_ENDPOINT: string;
  SERVICES_ENDPOINT: string;

  NIVEL_1_RETENCION: string;
  NIVEL_2_RETENCION: string;
  NIVEL_3_RETENCION: string;

  IP_CLIENT: string[];
  USER_UIO: string;

  USER_CARTERA_BOOL: string;

  constructor(private config: AppConfig) {
    this.API_ENDPOINT = config.get('API_ENDPOINT');
    this.AUTH_ENDPOINT = config.get('AUTH_ENDPOINT');
    this.BASE_REF = config.get('BASE_REF');
    this.URL_TRACKING_CONTRATOS = config.get('URL_TRACKING_CONTRATOS');
    this.URL_HISTORIAL = config.get('URL_HISTORIAL');
    this.ID_GOOGLE_ANALITICS = config.get('GA_TRACKING_ID');
    this.CLIENT_ID = config.get('CLIENT_ID');

    this.CODIGO_PLATAFORMA = config.get('CODIGO_PLATAFORMA');
    this.CODIGO_APLICACION = config.get('CODIGO_APLICACION');
    this.URL_CATALOGO_APLICACION_PLATAFORMA = config.get('URL_CATALOGO_APLICACION_PLATAFORMA');

    this.API_CORPORATIVO_ENDPOINT = config.get('API_CORPORATIVO_ENDPOINT');
    this.SERVICES_ENDPOINT = config.get(' SERVICES_ENDPOINT');

    this.PUSH_MENSAJE_ODA = config.get('PUSH_MENSAJE_ODA');
    this.PUSH_TITULO_ODA = config.get('PUSH_TITULO_ODA');
    this.PUSH_CATEGORIA_ODA = config.get('PUSH_CATEGORIA_ODA');
    this.PUSH_APLICACION_ID_ODA = config.get('PUSH_APLICACION_ID_ODA');

    this.NIVEL_1_RETENCION = config.get('NIVEL_1_RETENCION');
    this.NIVEL_2_RETENCION = config.get('NIVEL_2_RETENCION');
    this.NIVEL_3_RETENCION = config.get('NIVEL_3_RETENCION');

    this.IP_CLIENT = config.get('IP_CLIENT');
    this.USER_UIO = config.get('USER_UIO');
    
    this.USER_CARTERA_BOOL = config.get('USER_CARTERA_BOOL');

  }
}