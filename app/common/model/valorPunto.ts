export class ValorPuntoFilter {
    constructor(
        public CodigoGrupoArancel?: number,
        public FechaIncurrencia?: Date
    ) { }
}

export class ValorPunto {
    constructor(
        public CodigoGrupoArancel?: number,
        public Nivel?: number,
        public Valor?: number,
        public FechaDesde?: Date,
        public FechaHasta?: Date,
        public Tipo?: number //1 Individual y 2 Coorporativo
    ) { }
}