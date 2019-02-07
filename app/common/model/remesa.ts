export class RemesaEntity {
    constructor(
        public NumeroRemesa?: number,
        public FechaCorte?: Date,
        public NumeroCuentaCorriente?: number,
        public TotalCuentaCorriente?: number,
        public NumeroCuentaAhorros?: number, 
        public TotalCuentaAhorros?: number,
        public NumeroTarjetaCredito?: number, 
        public TotalTarjetaCredito?: number, 
        public NumeroPagoDirecto?: number, 
        public TotalPagoDirecto?: number, 
        public TotalGeneral?: number, 
        public TotalCobrado?:number,
        public NumeroContratos?: number, 
        public CodigoBanco?: number, 
        public FechaEnvio?: Date, 
        public Region?:string,

        public Selected?: boolean
    ) {    }
}