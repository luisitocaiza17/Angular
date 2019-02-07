export class DirectorVendedorFilter {
    constructor(
        public CodigoDirector?: number,
        public ApellidosDirector?:string,
        public CodigoVendedor?: string,
        public Apellidos?: string,
        public Estado?: number,
        public Region?: string
    ) { }
}