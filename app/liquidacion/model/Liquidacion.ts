export class Liquidacion {
    constructor(
        public NumeroReclamo?: number,
        public NumeroAlcance?: number,
        public Estado?: boolean,
        public FechaIncurrencia?: Date,
        public Tope?: string,
        public Plan?: string,
        public VersionPlan?: string,
        public Deducible?: string,
        public LugarAtencion?: string,
        public FormaPago?: string,
        public Emision?: string,
        public TipoEnfermedad?: string,
        public FechaHospitalizacion?: Date,
        public Tipo?: string,
        public Tratamiento?: string,
        public CoorBeneficio?: string,
        public NumeroSobre?: string,
        public Asegurador?: string

    ) { }
}