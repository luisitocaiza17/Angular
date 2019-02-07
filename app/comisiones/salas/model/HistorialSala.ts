import { ObservacionSalas } from "./ObservacionSalas";

export class HistorialSala {
    constructor(
        public Nombre?:string,
        public Codigo?:number,
        public Abreviacion?:string,
        public Estado?:string,        
        public Usuario?:string,
        public Observaciones?:ObservacionSalas[]
    ) { }
}