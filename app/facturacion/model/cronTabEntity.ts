export class CronTabEntity {
    constructor(
        public Diariamente?: boolean,
        public Lunes?: boolean,
        public Martes?: boolean,
        public Miercoles?: boolean,
        public Jueves?: boolean,
        public Viernes?: boolean,
        public Sabado?: boolean,
        public Domingo?: boolean,
        public Hora?: number,
        public Minutos?: number,
        public Mes?: number,
        public DiaMes?: number
    ) { }
}






