import { ObservacionCanales } from "./observacionCanales";

export class HistorialCanales{
    constructor(
        public Nombre?:string,
        public Codigo?:number,
        public Usuario?:string,
        public Estado?:boolean,
        public Observaciones?:ObservacionCanales[]
    ) { }
}