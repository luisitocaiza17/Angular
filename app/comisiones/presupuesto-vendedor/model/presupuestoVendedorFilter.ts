export class PresupuestoVendedorFilter{
    constructor(
        public Desde?:number,
        public Hasta?:number,
        public Estado?: String,
        public Nivel?:String,
        public Tipo?:String,
        public CodigoSubtipo?:number,
        public Region?:String,
        public CodigoSucursal?:number,
        public CodigoRango?:number
    ){}
}