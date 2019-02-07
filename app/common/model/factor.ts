export class FactorEntity {
    constructor(
        //PR09
        public FactorHombres?: number,
        public FactorMujeres?: number,
        public FactorHijos?: number,

        //pr51
        public Precio?: number,

        //MOD BENEF
        public Factor?: number
    ) { }
}