export class DescuentoEntity {
    constructor(
        public CodigoDescuento?: number,
        public NumeroDesde?: number,
        public TipoCuenta?: number,
        public PorcentajeDescuento?: string
    ) { }
}