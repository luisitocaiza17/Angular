export class CentroMedico {
    constructor(
        public IdCentroMedico?: string,
        public IdCiudad?: string,
        public Nombre?: string
    ) { }
}

export class CentroMedicoEntity {
    constructor(
        public idCentroMedico?: number,
        public nombre?: string,
        public nombreCorto?: string,
        public tipoDocumento?: string,
        public numeroDocumento?: string,
    ) { }
}
