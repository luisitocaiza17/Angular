export class BonoEntity{ 
    constructor(
        public Id?: number, 
        public Nombre?: string, 
        public Estado?: boolean, 
        public Tipo?: number,

        public Agencias?: BonoAgenciaCompetenciaEntity[], 
        public Detalles?: BonoDetalleEntity[],

        public Selected?: boolean
    ){ 
    }
}

export class BonoAgenciaCompetenciaEntity{ 
    constructor(
        public Id?: number, 
        public IdBono?: number, 
        public IdSucursal?: number,
        public NombreSucursal?: string,
        public Estado?: Boolean,
    ){ 
       
    }
}

export class BonoDetalleEntity{ 
    constructor(
        public Id?: number, 
        public IdBono?: number, 
        public IdSubtipo?: number,
        public Desde?: number,
        public Hasta?: number,
        public Valor?: number,
        public Estado?: Boolean,
    ){ 
       
    }
}

export class TipoBono{ 
    constructor(
        public Id?: number, 
        public Nombre?: string
    ){ 
    }
}