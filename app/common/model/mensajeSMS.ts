export class MensajeSMS{
     constructor(
         public Data?: string[],
         public CelularDestino?: string,
         public IDMensaje?:number
     ){
     }
}

export class TipoSMS {
    public static ASIGNACION: number = 15044;
    public static DEVOLUCION: number = 15048;
}