import { ObservacionNiveles } from "./ObservacionNiveles";

export class HistorialNiveles {
    constructor(
        public Nombre?:string,
        public Codigo?:number,
        public Estado?:boolean,
        public Usuario?:string,
        public Observaciones?:ObservacionNiveles[]
    ) { }
}