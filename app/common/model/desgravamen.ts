import { ContratoKey } from "./contrato";

export class DesgravamenFilter {
    constructor(
        public FechaInicioSeguro?: Date,
        public FechaFinContrato?: Date,
        public CodigoMotivoAnulacion?: number,
        public CodigoEstadoContrato?: number,
        public TitularConBeneficion?: number,
        public ContratoKey?: ContratoKey
    ) { }
}


