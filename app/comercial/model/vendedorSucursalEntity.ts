export class VendedorSucursalEntity {
    constructor(
        public Codigo?: number,
        public Nombre?: string,
        public EsPrincipal?: boolean,
        public Region?: string,
        public FechaCreacion?: Date,
        public DigitadorCreacion?: string,
        public CodigoEstado?: number,
        public Estado?: string,
        public FechaModificacion?: Date,
        public DigitadorModificacion?: string,
        public HoraCreacion?: string,
        public HoraModificacion?: string,
        public ProgramaModificacion?: string,
        public TipoSucursal?: string
    ) { }
}