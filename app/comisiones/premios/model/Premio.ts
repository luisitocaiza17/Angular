import { Agencia } from "./Agencia";

export class Premio {
    constructor(
        public Nombre?:string,
        public Estado?:boolean,
        public Id?:number,
        public Agencias?:Agencia[],
        public TipoProducto?:string,
        public IdCanal?:number,
        public TipoPremio?:number
    ){
    }
}