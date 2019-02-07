export class TipoVendedorEntity {
    constructor(
        public Codigo?: number,
        public CodigoGrupo?: number,
        public Nombre?: string,
        public Descripcion?: string,
        public ValorInicial?: number,
        public ValorFinal?: number,
        public FechaCreacion?: Date,
        public DigitadorCreacion?: string,
        public Estado?: number,
        public FechaModificacion?: Date,
        public DigitadorModificacion?: string,
        public HoraCreacion?: string,
        public HoraModificacion?: string,
        public ProgramaModificacion?: string
    ) { }
}