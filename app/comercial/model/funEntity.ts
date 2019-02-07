export class FunEntity {
    constructor(
        public NumeroFun?: number,
        public NumeroSerie?: number,
        public Estado?: number,
        public Observacion?: string,
        public UsuarioEmisor?: number,
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
        public CodigoAgenteVenta?: number,
        public CodigoEjecutivo?: number,
        public NumeroMotivo?: number,
        public AuditoriaAnulacion?: string,
        public AuditoriaReasignacion?: string,
        public DescripcionDevolucion?: string,
        public EsChequeoMedico?: boolean,
        public CodigoProducto?: string,
        public AdUsuarioEmisor?: string,
        public DescripcionEstado?: string,
        public NombreVendedor?: string,
        //UIO 
        public Selected?: boolean
    ) { }
}