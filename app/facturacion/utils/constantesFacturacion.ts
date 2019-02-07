import { Injectable } from '@angular/core';

@Injectable()
export class ConstantesFacturacion{

  //OFICINAS
  OFICINA_CONTAQ: String;
  OFICINA_COB: String;
  OFICINA_OPERAGP:String;
  OFICINA_FACTU:String;


  constructor() {
    this.OFICINA_COB = "COB";
    this.OFICINA_CONTAQ = "CONTAQ";
    this.OFICINA_OPERAGP="OPERAGP";
    this.OFICINA_FACTU="FACTU";

  }
}