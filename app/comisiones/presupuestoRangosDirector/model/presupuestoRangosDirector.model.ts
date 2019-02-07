export class PresupuestoRangosDirectorEntity
{
    constructor(
        public Codigo?: number,
        public Estado?: boolean,
        public CodigoSala?: number,
        public NombreSala?: string,
        public ValorDesde?: number,
        public ValorHasta?: number,
        public Porcentaje?: number, 
        public Selected?: boolean
    ){ 

    }
}

export class PresupuestoRangosDirectorFilter{
    constructor(
        public Region?: number,
        public CodigoSucursal?: number,
        public CodigoSala?: number, 
        public Estado?: boolean,
        public ValorDesde?: number,
        public ValorHasta?: number,
    ){}
}