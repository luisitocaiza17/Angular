export class CarenciaFilter {
    constructor(
        public CodigoContrato?: number,
        public PersonaNumero?: number,
    ) { }
}

export class Carencia {
    constructor(
        public VersionPlan?: number,
        public CodigoPlan?: string,
        public Estado?: boolean,
        public DiasCarenciaAmbulatoria?: number,
        public DiasCarenciaHospitalaria?: number,
        public CodigoProducto?: string,
        public FechaInicio?: string,
        public Persona?: string,
        public CodigoCobertura?: string,
        // UI
        public Selected?: boolean,
        public NombreEstado?: string,
    ) { }
}

export class CoberturaCarencia {
    constructor(
        public CodigoCobertura?: string,
        public DiasCarenciaHospitalaria?: number,
        public DiasCarenciaAmbulatoria?: number,
        public DiasCarenciaPreexistencia?: number
    ) { }
}