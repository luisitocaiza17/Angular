export class FiltroAgenteVenta{ 
    constructor(
        public CodigoVendedor?: string, 
        public CodigoAgenteVenta?: number, 
        public Nombre?: string,
        public Region?: string, 
        public Estado?: number, 
        public Tipo?: string, 
        public CodigoDirector?: number,
        public CodigoSala?: number
    ){ 

    }
}