export class EspecialidadVerisFilter {
    constructor(
        public IdMedico?: string,
        public CodigoEspecialidad?: string
    ) { }
}

export class EspecialidadVeris {
    constructor(
        public Causa?: string,
        public Codigo?: string,
        public IdEspecialidad?: string,
        public Mensaje?: string,
        public NombreEspecialidad?: string
    ) { }
}


export class EspecialidadEntity {
    constructor(
        public idEspecialidad?: number,
        public codigoEspecialidad?: string,
        public nombreEspecialidad?: string,
        public descripcionEspecialidad?: string
    ) { }
}


