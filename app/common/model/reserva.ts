import { CronTabEntity } from "../../facturacion/model/cronTabEntity";

export class ReservaFilter {
    constructor(
        public FechaDesde?: Date,
        public FechaHasta?: Date,
        public FechaProceso?: Date,
        public PorcentajeSuscripcion?: number,
        public PorcentajeCorrientes?: number,
        public EsSuscripcion?: boolean,
        public EsCorriente?: boolean,
        public EsCanceacion?: boolean,
        public CronTab?: CronTabEntity,
    ) { }
}

export class ReservaCabeceraEntity {
    constructor(

        public IdProcesoReserva?: number,
        public Secuencial?: number,
        public Nombre?: string,
        public FechaProceso?: Date,
        public Periodo?: string,
        public Estado?: number
    ) {

    }

}

export class PorcentajesEntity {
    constructor(

        public Id :number,
        public  Mes :string,
        public  PorcentajeCorrientes :number,
        public  PorcentajeSuscripcion :number
    ) {

    }

}