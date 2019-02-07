export class GrupoVendedorEntity {
    constructor(
        public Nombre?: string,
        public Descripcion?: string,
        public Codigo?: number,
        public TieneCelulas?: boolean,
        public FechaCreacion?: Date,
        public DigitadorCreacion?: string,
        public CodigoEstado?: number,
        public Estado?: string,
        public FechaModificacion?: Date,
        public DigitadorModificacion?: string,
        public HoraCreacion?: string,
        public HoraModificacion?: string,
        public ProgramaModificacion?: string
    ) { }
}