import { ObservacionSubtipo } from "./ObservacionSubtipo";

export class HistorialSubtipo {
    constructor(
        public Nombre?:string,
        public Codigo?:number,
        public Usuario?:string,
        public Estado?:boolean,
        public Observaciones?:ObservacionSubtipo[]
    ) { }
}