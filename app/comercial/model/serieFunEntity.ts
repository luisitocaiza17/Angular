export class SerieFunEntity {
    constructor(
        public Numero?: number,
        public Region?: string,
        public CodigoSucursal?: number,
        public Estado?: number,
        public PorcentajeMinimo?: number,
        public NumeroInicialFun?: number,
        public NumeroFinalFun?: number,
        public Observaciones?: string,
        public EmisorSerie?: number,
        public ReceptorSerie?: number,
        public FechaEntrega?: Date,
        public FechaCierre?: Date,
        public FechaCreacion?: Date,
        public HoraCreacion?: string,
        public UsuarioCreacion?: string,
        public ProgramaCreacion?: string,
        public FechaModificacion?: Date,
        public HoraModificacion?: string,
        public UsuarioModificacion?: string,
        public ProgramaModificacion?: string,
        public CodigoProducto?: string,
        public AdUsuarioEmisor?: string,
        public AdUsuarioReceptor?: string,
        public DescripcionEstado?: string,

        //UIO 
        public NumeroMotivo?: number
    ) { }
}