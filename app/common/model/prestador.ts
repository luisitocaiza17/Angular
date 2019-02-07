export class PrestadorFilter {
    constructor(
        public CodigoCiudad?: string,
        public CodigoEspecialidad?: string,
        public Fecha?: Date,
        public CodigoCentroMedico?: string,
        public CodigoContrato?: number,
        public NumeroContrato?: number,
        public NumeroCedula?: string
    ) { }
}

export class Prestador {
    constructor(
        public CentralMedical?: string,
        public Ciudad?: string,
        public DiasAtencion?: string,
        public Horario?: string,
        public IdMedico?: number,
        public Ipn?: string,
        public NumeroIdentificacion?: string,
        public PrimerApellido?: string,
        public PrimerNombre?: string,
        public Sector?: string,
        public SegundoApellido?: string,
        public SegundoNombre?: string,
        public TipoIdentificacion?: string,
        public Especialidad?: string,
        public ValorAPagar?: string,
        public Calificacion?: string,
        public NewKey?: boolean,
        public NumeroCedula?: string,
        public CodigoCentroMedico?: string,
        public CodigoEspecialidad?: string
    ) { }
}

export class PrestadorKey {
    constructor(
        public CentralMedical?: string,
        public Ciudad?: string,
        public DiasAtencion?: string,
        public Horario?: string,
        public IdMedico?: number,
        public Ipn?: string,
        public NumeroIdentificacion?: string,
        public PrimerApellido?: string,
        public PrimerNombre?: string,
        public Sector?: string,
        public SegundoApellido?: string,
        public SegundoNombre?: string,
        public TipoIdentificacion?: string,
        public Especialidad?: string,
        public ValorAPagar?: string,
        public Calificacion?: string,
        public NewKey?: boolean,
        public NumeroCedula?: string,
        public CodigoCentroMedico?: string,
        public CodigoEspecialidad?: string

    ) {
        this.NewKey = true;
    }
}

export class MedicosFilter {
    constructor(
        public TipoCliente?: number,
        public CodigoCiudad?: number,
        public NivelDesde?: number,
        public NivelHasta?: number,
        public ValorConsulta?: number,
        public CodigoContrato?: number,
        public NumeroPersonaBeneficiario?: number,
        public codigoEspecialidad?: string
    ) { }
}