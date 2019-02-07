export class DetallePremio{
    constructor(
        public Id?:number,
        public ValorMinimo?:number,
        public IdTablaPremio?:number,
        public IdSubtipo?:string,
        public Desde?:number,
        public Hasta?:number,
        public Estado?:boolean,
        public NombreSubtipo?:string,
        public IdTipo?:number
    ){}
}
