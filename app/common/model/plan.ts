import { ContratoKey } from '../model/contrato';
import { DetalleRemesa } from '../model/detalleRemesa';
import { SeguroCampesinoEntity } from '../model/transacciones';


export class PlanFilter {
    constructor(
        public CodigoContrato?: number,
        public Version?: number,
        public CodigoPlan?: string,
        public Region?: string,
        public CodigoProducto?: string,
        public NumeroPersona?: number,
        public Transicion?: boolean,

        //SOLO PARA LA TRANSACCION QUITAR CARENCIA
        public NumeroContrato?: number,
        public CodigoRegion?: string
    ) { }
}

export class Plan {
    constructor(
        public CodigoPlan?: string,
        public NombrePlan?: string,
        public CodigoVersion?: number,
        public CodigoProducto?: string,
        public Region?: string,
        public FechaInicio?: string,
        public FechaFin?: string,
        public NumProcedimiento?: number,
        public Nivel?: number,
        public Key?: string,
        public Value?: string,
        // UI
        public Selected?: boolean,

        public Cobertura?: string,
        public TipoAtencionRct?: string,
        public TipoGrupal?: number
    ) { }
}

export class PlanCambioEntity {
    constructor(
        public PrecioBase?: number,
        public MedicinaPrepagada?: number,
        public Descuento?: number,
        public CodigoCabecera?: number,
        public CodigoPlan?: string,
        public VersionPlan?: number,
        public NivelReferencia?: number,
        public NombrePlan?: string,
        public TipoDato?: string,
        public Valor?: string,
        public Proceso?: string
    ) { }
}

export class PlanContrato {
    constructor(
        public Plan?: PlanCambioEntity,
        public Contrato?: ContratoKey,
        public DetalleRemesa?: DetalleRemesa,
        public Seguro?: SeguroCampesinoEntity
    ) { }
}

export class AprobacionPlanFilter {
    constructor(
        public CodigoPlanActual?: string,
        public VersionPlanActual?: number,
        public CodigoPlanNuevo?: string,
        public VersionPlanNuevo?: number,
        public CodigoProducto?: string,
        public Region?: string
    ) { }
}

export class AprobacionPlanEntity {
    constructor(
        public NivelAprobacion?: string,
        public TieneAprobacion?: boolean
    ) { }
}
