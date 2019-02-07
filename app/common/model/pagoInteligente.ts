export class PagoInteligenteFilter {
    constructor(
        public NumeroReclamo?: number,
        public NumeroAlcance?: number
    ) { }
}

export class PagoInteligente {
    constructor(
        public NumeroReclamo?: string,
        public NumeroAlcance?: string,
        public NumeroEnvio?: string,
        public SecuencialEnvio?: string,
        public Secuencial?: string,
        public NombreBeneficiario?: string,
        public Estado?: string,
        public MotivoRechazo?: string
    ) { }
}

