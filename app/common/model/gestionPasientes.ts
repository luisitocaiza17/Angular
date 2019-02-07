export class CasoFilter {
    constructor(
        public CodigoContrato?: string,
        public NumeroPersona?: string,
        public AutorizacionHeader?: string,

        public NumeroAutorizacion?: number,
        public NumeroCaso?: number,
        public ValorCupo?: number,
        public FechaHora?: string,
        public CodigoCobertura?: number,
        public IdConvenioPrestador?: number,
        public Diagnostico?: string[],
        public MontoAutorizado?: number,
        public FechaIngreso?: string,
        public TipoCobertura?: string,

        public EstadoContrato?: string,
        public FechaInclusion?: string,
        public FechaExclusion?: string,
        public NombresBeneficiario?: string,
        public ApellidosBeneficiario?: string,
        public TipoDocumentoIdentificacion?: string,
        public NumeroDocumentoIdentificacion?: string,
        public EdadBeneficiario?: number,
        public GeneroBeneficiario?: string,
        public MaternidadBeneficiario?: boolean,
        public Observaciones?: string,

        public idConvenio?: string,
        public nombreMedico?: string,
        public estadoCobertura?: string,
        public estadoConvenio?: string,
        public NombreCentroMedico?: string

    ) { }
}

export class Caso {
    constructor(
        public numeroCaso?: number,
        public observaciones?: string,
        public estado?: string,
        public fechaCreacion?: string,
        public nombreBeneficiario?: string,
        public numeroPersona?: number,
        public codigoContrato?: string,
        public diagnostico?: Diagnostico    
        
    ) { 
    }
}

export class Diagnostico {
    constructor(
        public observaciones?: string,
        public enfermedades?: Enfermedades[]
    ) { 
    }
}

export class Enfermedades {
    constructor(
        public codigo?: string,
        public enfermedad?: string
    ) { 
    }
}


