export class ProcedimientoFilter {
    constructor(
        public CodigoHarvard?: string,
        public Nombre?: string,
        public CodigoBeneficio?: string
    ) { }
}

export class Procedimiento {
    constructor(
        public Codigo?: string,
        public NombreProcedimiento?: string,
        public ValorPorPuntos?: number,
        public Puntaje?: number,
        public ValorUnitario?: number,
        public CodigoHarvard?: string,
        public PuntosHarvard?: number,
        public PuntosMcGraw?: number,
        public Beneficio?: string,
        public CodigoGrupoArancel?: number,
        public DescripcionGrupoArancel?: string,
        public CodigoBeneficio?: string,

        public Selected?: boolean
    ) { }
}