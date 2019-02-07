export class PacienteVerisFilter {
    constructor(
        public FechaNacimiento?: string,
        public Mail?: string,
        public NumeroIdentificacion?: string,
        public PrimerApellido?: string,
        public PrimerNombre?: string,
        public SegundoApellido?: string,
        public TelefonoMovil?: string,
        public TipoIdentificacion?: string,
        public Genero?: string
    ) { }
}

export class PacienteVeris {
    constructor(
        public Causa?: string,
        public Codigo?: string,
        public IdPaciente?: string,
        public Mensaje?: string
    ) { }
}

