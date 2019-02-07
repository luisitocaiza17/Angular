export class CalificacionPrestadorFilter {
    constructor(
        public NumeroConvenio?: number,
        public Calificacion?: number,
        public Comentario?: string,
        public Especialidad?: string,
        public Login?: string,
        public NumeroReclamo?: number,
        public Region?: string,
        public FechaDesde?: Date,
        public FechaHasta?: Date
    ) { }
}

export class CalificacionPrestador {
    constructor(
        public Oda?: string,
        public Convenio?: string,
        public Region?: string,
        public Calificacion?: string,
        public Comentario?: string,
        public Especialidad?: string,
        public FechaCalificación?: string
    ) { }
}

