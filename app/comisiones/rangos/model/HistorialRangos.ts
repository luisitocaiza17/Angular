import { ObservacionRangos } from "./ObservacionRangos";

export class HistorialRangos{
    constructor(
        public Nombre?:string,
        public Codigo?:number,
        public Usuario?:string,
        public Estado?:boolean,
        public Observaciones?:ObservacionRangos[]
    ) { }
}