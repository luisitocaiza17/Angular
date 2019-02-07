export class MotivosFunEntity {
    constructor(
        public Codigo?: number,
        public NumeroMotivo?: number,
        public Estado?: number,
        public Descripcion?: string,
        public Observacion?: string,
        public FechaCreacion?: Date,
        public HoraCreacion?: string,
        public UsuarioCreacion?: string,
        public ProgramaCreacion?: string,
        public FechaModificacion?: Date,
        public HoraModificacion?: string,
        public UsuarioModificacion?: string,
        public ProgramaModificacion?: string
    ) { }
}