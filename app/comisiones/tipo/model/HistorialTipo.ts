import { ObservacionTipo } from "./ObservacionTipo";

export class HistorialTipo{
    
    constructor(
        public Nombre?:string,
        public Codigo?:number,
        public Usuario?:string,
        public Estado?:boolean,
        public Observaciones?:ObservacionTipo[]
    ) { }
}