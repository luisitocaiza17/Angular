import { BancoEntity } from "../../common/model/genericos";
import { RemesaEntity } from "../../common/model/remesa";

export class ResultadoGenerarArchivosBancos {
    constructor(
        public FileName?: string,
        public RegistrosProcesados?: number,
        public RegistrosErrorNombreDuenioCuentaVacio?: number
    ) { }
}

export class EstadoRecaudos {
    constructor(
        public bancoSelected?: BancoEntity,
        public bancoAnterior?: BancoEntity,
        public utlimasRemesasBanco?: RemesaEntity[],
        public remesaSelected?: RemesaEntity
    ) {
        this.bancoSelected = new BancoEntity();
        this.bancoAnterior = new BancoEntity();
        this.utlimasRemesasBanco = [];
        this.remesaSelected = new RemesaEntity();
    }
}

export class InputForEnvioDebitosInstituciones {
    constructor(
        public Remesa?: RemesaEntity,
        public Banco?: BancoEntity,
        public EsReproceso?: boolean,
        public AniosSuma?: number,
        public TipoArchivo?: string,
        public BinesTarjetaCodificacion?: string
    ) { }

}

export class BinesTarjeta {
    constructor(
        public Bines: string,
        public Entidad: string,
        public Tipo: string,
        public Codificacion: string
    ) { }

}
