export class DetalleReclamoEntityList {
    constructor(
        public NombrePrestador?: string,
        public Detalles?: DetalleReclamo[]
    ) { }
}

export class DetalleReclamo {
    constructor(
        public NumeroLinea?: number,
        public NumeroProcedimiento?: string,
        public CodigoProcedimiento?: string,        
        public Procedimiento?: string,
        public Beneficio?: string,
        public ValorPresentado?: number,
        public CantidadPresentada?: number,
        public ValorNoCubierto?: number,
        public ValorCubierto?: number,
        public ValorDeducible?: number,        
        public ValorCopago?: number,
        public ValorBonificado?: number,
        public ValorPagado?: number
    ) { }
}