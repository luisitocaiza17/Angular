import { Injectable } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable()
export class ConstantesSobres {

  //TIPO COBERTURA
  ID_TIPO_COBERTURA_AMBULATORIO: number;
  ID_TIPO_COBERTURA_HOSPITALARIO: number;

  //NOVEDADES SOBRES
  ID_NOVEDAD_HELP: number;
  ID_NOVEDAD_REQUERIMIENTO: number;
  ID_NOVEDAD_PI: number;
  ID_NOVEDAD_DEPARTAMENTO_AUDITORIA_MEDICA: number;
  ID_NOVEDAD_AUD_MEDICA_RF: number;
  ID_NOVEDAD_DEVOLUCION: number;

  //TIPO DEVOLUCION
  ID_TIPO_DEVOLUCION_PARCIAL: number;
  ID_TIPO_DEVOLUCION_QPRA: number;

  //CODIGO ESTADOS SOBRES
  CODIGO_ESTADO_SOBRE_INGRESADO: number;
  CODIGO_ESTADO_SOBRE_ASIGNADO: number;
  CODIGO_ESTADO_SOBRE_REASIGNADO: number;
  CODIGO_ESTADO_SOBRE_LIQUIDADO: number;
  CODIGO_ESTADO_SOBRE_CODIFICADO: number;
  CODIGO_ESTADO_SOBRE_MORA: number;
  CODIGO_ESTADO_SOBRE_DEVUELTO: number;
  CODIGO_ESTADO_SOBRE_DEP_AUDITORIA_MEDICA: number;
  CODIGO_ESTADO_SOBRE_ANULADO: number;
  CODIGO_ESTADO_SOBRE_PENDIENTE: number;
  CODIGO_ESTADO_SOBRE_AUDITORIA_MEDICA_RF: number;
  CODIGO_ESTADO_SOBRE_QPRA: number;
  CODIGO_ESTADO_SOBRE_EN_PROCESO: number;

  //NOMBRES ESTADOS SOBRES
  NOMBRE_ESTADO_SOBRE_INGRESADO: string;
  NOMBRE_ESTADO_SOBRE_ASIGNADO: string;
  NOMBRE_ESTADO_SOBRE_REASIGNADO: string;
  NOMBRE_ESTADO_SOBRE_LIQUIDADO: string;
  NOMBRE_ESTADO_SOBRE_CODIFICADO: string;
  NOMBRE_ESTADO_SOBRE_MORA: string;
  NOMBRE_ESTADO_SOBRE_DEVUELTO: string;
  NOMBRE_ESTADO_SOBRE_DPTO_AUDITORIA_MEDICA: string;
  NOMBRE_ESTADO_SOBRE_ANULADO: string;
  NOMBRE_ESTADO_SOBRE_PENDIENTE: string;
  NOMBRE_ESTADO_SOBRE_AUD_MEDICA_RF: string;
  NOMBRE_ESTADO_SOBRE_QPRA: string;
  NOMBRE_ESTADO_SOBRE_EN_PROCESO: string;

  //TIPO ENVIO
  TIPO_SMS: string;
  TIPO_MAIL: string;
  TIPO_MAIL_SMS: string;


  NUMERO_SOBRE_VACIO: string;

  //ID TIPO CARTA
  ID_TIPO_CARTA_DEVOLUCION: number;
  ID_TIPO_CARTA_NEGATIVA_COBERTURA: number;

  //NOTAS 
  DESCRIPCION_NOTA_1: string;
  DESCRIPCION_NOTA_2: string;
  DESCRIPCION_NOTA_3: string;

  //ACCIONES SOBRES
  ACCION_INGRESAR: string;
  ACCION_EDITAR_SOBRE: string;
  ACCION_ENVIAR_MENSAJE_RECIBIDO: string;
  ACCION_ASIGNAR: string;
  ACCION_REASIGNAR: string;
  ACCION_CONSULTOR: string;
  ACCION_ENVIAR_MENSAJE_DEVOLUCION: string;
  ACCION_GESTIONAR: string;
  ACCION_ANULAR_SOBRE: string;
  ACCION_REQUIERE_AUTORIZAR_SOBRE: string;
  ACCION_AUTORIZAR_SOBRE: string;


  ID_TIPO_DOCUMENTO_SOBRE: number;


  constructor() {
    //COBERTURA
    this.ID_TIPO_COBERTURA_AMBULATORIO = 1;
    this.ID_TIPO_COBERTURA_HOSPITALARIO = 2;

    //Novedades Sobre
    this.ID_NOVEDAD_HELP = 1;
    this.ID_NOVEDAD_REQUERIMIENTO = 2;
    this.ID_NOVEDAD_PI = 3;
    this.ID_NOVEDAD_DEPARTAMENTO_AUDITORIA_MEDICA = 4;
    this.ID_NOVEDAD_AUD_MEDICA_RF = 5;
    this.ID_NOVEDAD_DEVOLUCION = 6;

    //TIPO DEVOLUCION
    this.ID_TIPO_DEVOLUCION_PARCIAL = 1;
    this.ID_TIPO_DEVOLUCION_QPRA = 2;

    //CODIGO ESTADOS SOBRES
    this.CODIGO_ESTADO_SOBRE_INGRESADO = 1;
    this.CODIGO_ESTADO_SOBRE_ASIGNADO = 2;
    this.CODIGO_ESTADO_SOBRE_REASIGNADO = 3;
    this.CODIGO_ESTADO_SOBRE_LIQUIDADO = 4;
    this.CODIGO_ESTADO_SOBRE_CODIFICADO = 5;
    this.CODIGO_ESTADO_SOBRE_MORA = 6;
    this.CODIGO_ESTADO_SOBRE_DEVUELTO = 7;
    this.CODIGO_ESTADO_SOBRE_DEP_AUDITORIA_MEDICA = 8;
    this.CODIGO_ESTADO_SOBRE_ANULADO = 9;
    this.CODIGO_ESTADO_SOBRE_PENDIENTE = 10;
    this.CODIGO_ESTADO_SOBRE_AUDITORIA_MEDICA_RF = 11;
    this.CODIGO_ESTADO_SOBRE_QPRA = 12;
    this.CODIGO_ESTADO_SOBRE_EN_PROCESO = 13;

    //Nombre Estado Sobres
    this.NOMBRE_ESTADO_SOBRE_INGRESADO = "Ingresado";
    this.NOMBRE_ESTADO_SOBRE_ASIGNADO = "Asignado";
    this.NOMBRE_ESTADO_SOBRE_REASIGNADO = "Reasignado";
    this.NOMBRE_ESTADO_SOBRE_LIQUIDADO = "Liquidado";
    this.NOMBRE_ESTADO_SOBRE_CODIFICADO = "Codificado";
    this.NOMBRE_ESTADO_SOBRE_MORA = "Mora";
    this.NOMBRE_ESTADO_SOBRE_DEVUELTO = "Devuelto";
    this.NOMBRE_ESTADO_SOBRE_DPTO_AUDITORIA_MEDICA = "Dpto de Auditoría médica";
    this.NOMBRE_ESTADO_SOBRE_ANULADO = "Anulado";
    this.NOMBRE_ESTADO_SOBRE_PENDIENTE = "Pendiente";
    this.NOMBRE_ESTADO_SOBRE_AUD_MEDICA_RF = "Aud.Médica RF";
    this.NOMBRE_ESTADO_SOBRE_QPRA = "QPRA";
    this.NOMBRE_ESTADO_SOBRE_EN_PROCESO = "En proceso";

    //Tipo
    this.TIPO_SMS = "SMS";
    this.TIPO_MAIL = "MAIL";
    this.TIPO_MAIL_SMS = "MAIL_SMS";

    this.NUMERO_SOBRE_VACIO = "NA";

    //ID TIPO CARTA
    this.ID_TIPO_CARTA_DEVOLUCION = 1;
    this.ID_TIPO_CARTA_NEGATIVA_COBERTURA = 2;

    //NOTAS
    this.DESCRIPCION_NOTA_1 = "Sus documentos originales serán entregados a su dirección de correspondencia en 72 horas hábiles";
    this.DESCRIPCION_NOTA_2 = "Sus documentos electrónicos quedan archivados en Saludsa. Recuerde que estos documentos se cargan automáticamente en la página del SRI para su consulta y declaración de impuestos.";
    this.DESCRIPCION_NOTA_3 = "Sus facturas tienen una validez de 90 días desde la fecha de emisión.";

    //ACCIONES
    this.ACCION_INGRESAR = "Ingresar Sobre";
    this.ACCION_EDITAR_SOBRE = "Editar Sobre"
    this.ACCION_ENVIAR_MENSAJE_RECIBIDO = "Enviar Mensaje Recibido";
    this.ACCION_ASIGNAR = "Asignar Sobre";
    this.ACCION_REASIGNAR = "Reasignar Sobre";
    this.ACCION_CONSULTOR = "Cambios en el Consultor";
    this.ACCION_GESTIONAR = "Gestionar el Sobre";
    this.ACCION_ENVIAR_MENSAJE_DEVOLUCION = "Enviar Mensaje de Devolución"
    this.ACCION_ANULAR_SOBRE = "Anular Sobre";
    this.ACCION_REQUIERE_AUTORIZAR_SOBRE = "Requiere Autorizar Sobre";
    this.ACCION_AUTORIZAR_SOBRE = "Autorizar Sobre";

    //tipo documento
    this.ID_TIPO_DOCUMENTO_SOBRE = 1;
  }
}