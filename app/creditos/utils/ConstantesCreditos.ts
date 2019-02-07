import { Injectable } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable()
export class ConstantesCreditos {

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

  //CODIGO ESTADOS CREDITOS
  CODIGO_ESTADO_CREDITO_EN_PRCOCESO: number;
  CODIGO_ESTADO_CREDTITO_SIN_ASIGNAR: number;
  CODIGO_ESTADO_CREDITO_EN_AUDITORIA: number;
  CODIGO_ESTADO_CREDITO_NEGADO: number;
  CODIGO_ESTADO_CREDITO_CODIFICADO: number;
  CODIGO_ESTADO_CREDITO_EN_LIQUIDACION: number;
  CODIGO_ESTADO_CREDITO_LIQUIDADO: number;
  CODIGO_ESTADO_CREDITO_DEVOLUCION: number;
  CODIGO_ESTADO_CREDITO_ANULADO: number;




  //NOMBRES ESTADOS CREDITOS
  NOMBRE_ESTADO_CREDITO_EN_PRCOCESO: string;
  NOMBRE_ESTADO_CREDTITO_SIN_ASIGNAR: string;
  NOMBRE_ESTADO_CREDITO_EN_AUDITORIA: string;
  NOMBRE_ESTADO_CREDITO_NEGADO: string;
  NOMBRE_ESTADO_CREDITO_CODIFICADO: string;
  NOMBRE_ESTADO_CREDITO_LIQUIDADO: string;
  NOMBRE_ESTADO_CREDITO_EN_LIQUIDACION: string;
  NOMBRE_ESTADO_CREDITO_EN_DEVOLUCION: string;
  NOMBRE_ESTADO_CREDITO_ANULADO: string;



  //TIPO ENVIO
  TIPO_SMS: string;
  TIPO_MAIL: string;
  TIPO_MAIL_SMS: string;


  NUMERO_SOBRE_VACIO: string;
  NUMERO_ESTABLECIMEIENTO: number;

  //ID TIPO CARTA
  ID_TIPO_CARTA_DEVOLUCION: number;
  ID_TIPO_CARTA_NEGATIVA_COBERTURA: number;

  //NOTAS 
  DESCRIPCION_NOTA_1: string;
  DESCRIPCION_NOTA_2: string;
  DESCRIPCION_NOTA_3: string;

  //ACCIONES SOBRES
  ACCION_INGRESAR: string;
  ACCION_ENVIAR_MENSAJE_RECIBIDO: string;
  ACCION_ASIGNAR: string;
  ACCION_ACTUALIZAR: string;
  ACCION_REASIGNAR: string;
  ACCION_CONSULTOR: string;
  ACCION_ENVIAR_MENSAJE_DEVOLUCION: string;
  ACCION_GESTIONAR: string;
  ACCION_ANULAR_SOBRE: string;
  ACCION_REQUIERE_AUTORIZAR: string;
  ACCION_AUTORIZAR: string;
  ID_TIPO_DOCUMENTO_CREDITO: number;



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
    this.CODIGO_ESTADO_CREDTITO_SIN_ASIGNAR = 14;
    this.CODIGO_ESTADO_CREDITO_EN_AUDITORIA = 15;
    this.CODIGO_ESTADO_CREDITO_DEVOLUCION = 16; 
    this.CODIGO_ESTADO_CREDITO_NEGADO = 17;
    this.CODIGO_ESTADO_CREDITO_CODIFICADO = 18;
    this.CODIGO_ESTADO_CREDITO_EN_LIQUIDACION = 19;
    this.CODIGO_ESTADO_CREDITO_LIQUIDADO = 20;
    this.CODIGO_ESTADO_CREDITO_ANULADO = 21;
       
    //Nombre Estado Sobres
    this.NOMBRE_ESTADO_CREDTITO_SIN_ASIGNAR= "Sin Asignar";
    this.NOMBRE_ESTADO_CREDITO_EN_AUDITORIA = "En Auditoria";
    this.NOMBRE_ESTADO_CREDITO_EN_DEVOLUCION = "Devuelto";
    this.NOMBRE_ESTADO_CREDITO_NEGADO = "Negado";
    this.NOMBRE_ESTADO_CREDITO_CODIFICADO = "Codificado";
    this.NOMBRE_ESTADO_CREDITO_EN_LIQUIDACION = "En Liquidacion";
    this.NOMBRE_ESTADO_CREDITO_LIQUIDADO = "Liquidado";
    this.NOMBRE_ESTADO_CREDITO_ANULADO = "Anulado";


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
    this.ACCION_INGRESAR = "Ingresar Credito";
    this.ACCION_ENVIAR_MENSAJE_RECIBIDO = "Enviar Mensaje Recibido";
    this.ACCION_ASIGNAR = "Asignar Credito";
    this.ACCION_REASIGNAR = "Reasignar Credito";
    this.ACCION_CONSULTOR = "Cambios en el Consultor";
    this.ACCION_GESTIONAR = "Gestionar el Credito";
    this.ACCION_ENVIAR_MENSAJE_DEVOLUCION = "Enviar Mensaje de Devolución"
    this.ACCION_ANULAR_SOBRE = "Anular Credito";
    this.ACCION_REQUIERE_AUTORIZAR = "Requiere Autorizar Crédito";
    this.ACCION_AUTORIZAR = "Autorizar Crédito";
    this.ACCION_ACTUALIZAR = "Actualizar Crédito";


    //tipo documento
    this.ID_TIPO_DOCUMENTO_CREDITO = 2;
    this.NUMERO_ESTABLECIMEIENTO = 43;
    
  }
}