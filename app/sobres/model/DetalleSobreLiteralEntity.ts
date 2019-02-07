export class DetalleSobreLiteralEntity {
    constructor(
        public IdSobreLiteral?: number,
        public IdDetalleSobre?: number,
        public IdLiteralClausula?: number,

        //Descripciones
        public IdMotivo?: number,
        public IdTipoCarta?: number,
        public IdClausula?: number,
        public DetalleLiteral?: string,
        public DetalleClausula?: string
    ) { }
}