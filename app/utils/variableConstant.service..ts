import { Injectable } from '@angular/core';

@Injectable()
export class VariablesConstantService {

  CODIGO_RELACION_TITULAR: number;
  CODIGO_RELACION_HIJO: number;
  CODIGO_RELACION_OTROS: number;
  RANGO_EDAD_MINIMO: number;
  RANGO_EDAD_MAXIMO: number;

  //CODIGOS ESTADOS
  CODIGO_ESTADO_ACTIVO: number;
  CODIGO_ESTADO_ANULADO: number;
  CODIGO_ESTADO_PENDIENTE: number;
  CODIGO_ESTADO_EN_PROCESO: number;
  CODIGO_ESTADO_CERRADA: number;
  CODIGO_ESTADO_ASUME_COBRADO: number;
  CODIGO_ESTADO_TRANSFERIDO: number;
  CODIGO_ESTADO_EMITIDO: number;
  CODIGO_ESTADO_DEVUELTO: number;
  CODIGO_ESTADO_PREEMITIDO: number;

  //TRANSACCIONES cl09-catalogo-transacciones
  CODIGO_SUSCRIPCION: number;
  CODIGO_CANCELACION: number;
  CODIGO_TERMINO_DEPENDIENTE: number;
  CODIGO_CAMBIO_DATOS_DEPENDIENTES: number;
  CODIGO_INCLUSION_DEPENDIENTES: number;
  CODIGO_CAMBIO_PRECIO: number;
  CODIGO_REACTIVACION_BENEFICIARIOS: number

  //ROL NIVEL
  ROL_NIVEL1: string;
  ROL_NIVEL2: string;
  ROL_NIVEL3: string;

  //NIVEL
  NIVEL1: string;
  NIVEL2: string;
  NIVEL3: string;

  //MODULO MODIFICACION BENEFICIARIOS
  MODULO_TRANSACCION: string;
  MODULO_RETENCION: string;

  constructor() {
    this.CODIGO_RELACION_TITULAR = 1;
    this.CODIGO_RELACION_HIJO = 3;
    this.CODIGO_RELACION_OTROS = 5;
    this.RANGO_EDAD_MINIMO = 18;
    this.RANGO_EDAD_MAXIMO = 23;


    //ESTADOS
    this.CODIGO_ESTADO_ACTIVO = 1;
    this.CODIGO_ESTADO_ANULADO = 2;
    this.CODIGO_ESTADO_PENDIENTE = 3;
    this.CODIGO_ESTADO_EN_PROCESO = 22;
    this.CODIGO_ESTADO_CERRADA = 23;
    this.CODIGO_ESTADO_ASUME_COBRADO = 24;
    this.CODIGO_ESTADO_TRANSFERIDO = 27;
    this.CODIGO_ESTADO_EMITIDO = 30;
    this.CODIGO_ESTADO_DEVUELTO = 35;
    this.CODIGO_ESTADO_PREEMITIDO = 62;

    //TRANSACCIONES cl09-catalogo-transacciones
    this.CODIGO_SUSCRIPCION = 1;
    this.CODIGO_CANCELACION = 2;
    this.CODIGO_TERMINO_DEPENDIENTE = 3;

    this.CODIGO_CAMBIO_PRECIO = 9;
    this.CODIGO_INCLUSION_DEPENDIENTES = 10;
    this.CODIGO_REACTIVACION_BENEFICIARIOS = 19;
    this.CODIGO_CAMBIO_DATOS_DEPENDIENTES = 101;

    this.ROL_NIVEL1 = "Ejecutivo Contact Center";
    this.ROL_NIVEL2 = "Jefatura SAC Costa";
    this.ROL_NIVEL3 = "Subgerencia Nacional";

    this.NIVEL1 = "Nivel1";
    this.NIVEL2 = "Nivel2";
    this.NIVEL3 = "Nivel3";

    this.MODULO_TRANSACCION = "Transaccion";
    this.MODULO_RETENCION = "Retencion";
  }
}