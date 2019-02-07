export class OrdenAtencionFilter {
    constructor(
        public NumeroReclamo?: number,
        public IdentificacionBeneficiario?: string,
        public NumeroConvenio?: number,
        public CodigoEstado?: number,
        public NumeroPagina?: number,       
        public RegistrosPagina?: number,
        public FechaDesde?: Date,
        public FechaHasta?: Date,
        public TotalRegistros?: number,
    ) { }
}

export class OrdenAtencion {
    constructor(
        public Contrato?: string,
        public NombresTitular?: string,
        public NombresPaciente?: string,
        public ApellidosPaciente?: string,
        public NivelContrato?: string,
        public NombresMedico?: string,
        public NivelDesde?: string,
        public NivelHasta?: string,
        public Especialidad?: string,
        public Region?: string
    ) { }
}

