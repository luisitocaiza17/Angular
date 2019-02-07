export class MovimientoListaEntity{
    constructor(
        public CodigoProducto?:string,
        public MovimientoNumero?:number,
        public EmpresaNumero?:number,
        public SucursalEmpresa?:number,
        public FechaMovimiento?:Date,
        public FechaEfectoMovimiento?:Date, 
        public CodigoTransaccion?:number,
        public Digitador?:string,
        public TerminalUsuario?:string,
        public Programa?:string,
        public Region?:string,
        public ReferenciaDocumento?:number, 
        public EstadoMovimiento?:number,
        public Precio?:number,
        public Servicio?:string
            
    ){

    }
}