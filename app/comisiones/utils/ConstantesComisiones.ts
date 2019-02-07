import { Injectable } from '@angular/core';
import { TipoBono } from '../model/bonos.model';

@Injectable()
export class ConstantesComisiones {


  ESTADO_ACTIVO: number;
  ESTADO_INACTIVO: number;
  DESCRIPCION_ACTIVO: string;
  DESCRIPCION_INACTIVO: string;
  ESTADO_OBJETO: object[];
  TIPO_PRESUPUESTO_VENDEDOR : object[];
  TIPO_SEMAFORO_CUOTA_1: number;
  TIPO_SEMAFORO_GESTION_VENTA: number;
  SEMAFORO_CUOTA_1 :string;
  SEMAFORO_GESTION_VENTA :string;
  ACCION_PREMIO_CREAR:string;
  ACCION_PREMIO_EDITAR: string;
  
  
  TIPO_VENDEDOR:string;

  COLOR_AMARILLO: string;
  COLOR_VERDE: string;
  COLOR_ROJO: string;
  ANIO_INICIAL_COMISIONES: number;

  TIPOS_BONO: TipoBono[]; 
  

  constructor() {

    this.SEMAFORO_CUOTA_1 = "Cuota 1";
    this.SEMAFORO_GESTION_VENTA = "Gestión de Ventas";
    

    this.ESTADO_ACTIVO = 1;
    this.ESTADO_INACTIVO = 0;
    this.DESCRIPCION_ACTIVO = "Activo";
    this.DESCRIPCION_INACTIVO = "Inactivo";
    this.ESTADO_OBJETO = [
      {
          Nombre: this.DESCRIPCION_ACTIVO
      },
      {
          Nombre: this.DESCRIPCION_INACTIVO
      }
    ];

    this.TIPO_VENDEDOR = "VENDEDOR";
    this.TIPO_PRESUPUESTO_VENDEDOR = [
      {
        Codigo: 1,
        Nombre: "Normal"
      },
      {
        Codigo: 2,
        Nombre: "Vacaciones hasta 7 días"
      },{
        Codigo: 3,
        Nombre: "Vacaciones más de 7 días"
      },{
        Codigo: 4,
        Nombre: "Ausentismo hasta 7 días"
      },{
        Codigo: 5,
        Nombre: "Ausentismo más de 7 días"
      },{
        Codigo: 6,
        Nombre: "Doble pago servicios adicionales"
      }
    ];
    this.TIPO_SEMAFORO_CUOTA_1 = 1;
    this.TIPO_SEMAFORO_GESTION_VENTA = 2;
    
    
    this.COLOR_AMARILLO = "AMARILLO";
    this.COLOR_VERDE = "VERDE";
    this.COLOR_ROJO = "ROJO";
    this.ANIO_INICIAL_COMISIONES = 2018;

    this.TIPOS_BONO = [ new TipoBono(1, "Persistencia")];
  }
}