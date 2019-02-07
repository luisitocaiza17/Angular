export class SalasFilter {
    constructor(
        public Region?: string,
        public Abreviacion?: string,
        public Estado?: String,
        public Nombre?:string,
        public CodigoSucursal?:number,
        public CodigoRegion?:number
    ) { }
}