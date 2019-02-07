export class VendedoresEntity {
    constructor(
        public NumeroPersona?: number,
        public AgenteNombres?: string,
        public AgenteApellidos?: string,
        public CodigoVendedor?: string,
        public CodigoAgenteVenta?: number,
        public TipoAgenteVenta?: string,

        //UIO
        public Selected?: boolean,
        public PorcentajePersistencia ?:number,
        public FechaProduccionAgente ?:Date,
        public CodigoRango?:number,
        public CumplimientoQueja ?:boolean
    ) { }
}