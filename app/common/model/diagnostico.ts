export class DiagnosticoFilter {
    constructor(
        public Codigo?: string,
        public Nombre?: string,
        public EsCongenito?: boolean,
    ) { }
}

export class Diagnostico {
    constructor(
        public Id?: number,
        public Preexistencia?: boolean,
        public Tipo?: string,
        public CodigoDiagnostico?: string,
        public CabeceraDiagnostico?: string,
        public Diagnostico?: string,
        public AutorizacionId?: number,
        public EsCongenito?: boolean,
        public GrupoDiagnostico?: number,
        public Basico?: boolean,
        public Principal?: boolean,
        public Estado?: boolean,
        public FechaInicio?: Date,
        public FechaFin?: Date,
        public FechaUltimaDeclaracion?: Date,
    ) { }
}

