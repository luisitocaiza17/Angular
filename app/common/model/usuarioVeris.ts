export class UsuarioVerisFilter {
    constructor(
        public Documento?: string
    ) { }
}

export class UsuarioVeris {
    constructor(
        public IdPaciente?: string,
        public PrimerNombre?: string,
        public PrimerApellido?: string,
        public SegundoApellido?: string,
        public FechaNacimiento?: string,
        public Mail?: string,
        public FechaUltimaActualizacion?: string,
        public Codigo?: number,
        public Mensaje?: string,
        public Causa?: string
    ) { }
}

