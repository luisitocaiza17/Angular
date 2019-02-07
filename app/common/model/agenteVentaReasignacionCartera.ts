export class AgenteVentaReasignacionCartera {
    constructor(
        public PersonaNombres?: string,
        public PersonaApellidos?: string,
        public CodigoAgenteVenta?: string,
        public CodigoAgenteContacto?: number,
        public PersonaNumero?: number,
        public ComisionVenta?: number,
        public ComisionRenovacion?: number,
        public CodigoRegion?: string,
        public CodigoProducto?: string,
        public ContratoNumero?: string,
        public TipoAgenteVenta?: string,
        public NombreAgenteVenta?: string,
        public FechaSalidaAgente?: Date,
        public CodigoDirector?: number,
        public PagaComision?: number,
        public CodigoVendedor?: string,
        public NombreAgenteContacto?: string,
        public ComentarioNC?: string,

        //para el nuevo agente
        public auxCodigoAgenteVenta?: string,
        public viewCodVendedor?: string,
        public auxCodigoAgenteContacto?: number,
        public viewCodContacto?: string,

        //para el movimiento
        public NumeroSucursal?: number,
        public NumeroEmpresa?: string,
        public CodigoContrato?: number,

        public EsBroker?: boolean
    ) { }
}