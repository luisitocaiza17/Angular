import { CatalogoProgressEntity } from './catalogo';
import { DetalleRemesa } from './detalleRemesa';
import { DescuentoEntity } from './descuento';
import { Plan } from './plan';
import { PersonaUnicaEntity } from './persona';
import { ContratoKey, CorrespondenciaEntity } from './contrato';
import { BeneficiarioList } from './beneficiario';
import { Relacion } from './relacion';
import { DetalleRemesaCuotas } from './detalleRemesa';
import { ServiciosContratoEntity, ServiciosEntity, PrecioServicioEntity } from './servicioAdicionalPersona';
import { Catalogo } from './catalogo';
import { CoberturaCarencia } from './carencia';

export class TransaccionKey {
    constructor(
        public CodigoContrato?: number,
        public CodigoRegion?: string,
        public CodigoProducto?: string,
        public NumeroContrato?: number,
        public EmpresaNumero?: number,
        public SusursalEmpresa?: number
    ) { }
}

export class DatosAnulacionContrato {
    constructor(
        public FacturadoHasta?: Date,
        public CabecerasMotivoAnulacion?: CatalogoProgressEntity[],
        public MotivosAnulacion?: CatalogoProgressEntity[]
    ) { }
}

export class DatosReactivacionContrato {
    constructor(
        public DiasDesdeAnulacionContrato?: number,
        public NumeroCuotasPendientes?: number
    ) { }
}

export class DatosBancoContrato {
    constructor(
        public NombreBanco?: string,
        public CodigoBanco?: number
    ) { }
}

export class DatosPI {
    constructor(
        public Bancos?: DatosBancoContrato[]
    ) { }
}

export class CambioSelectPlan {
    constructor(
        public Mensaje?: string,
        public Text?: string
    ) { }
}

export class DatosFormaPago {
    constructor(
        public DetalleRemesa?: DetalleRemesa,
        public Bancos?: DatosBancoContrato[],
        public Meses?: number,
        public CantidadContratos?: number,
        public DescuentoActual?: number,
        public Descuento?: DescuentoEntity[]

    ) { }
}

export class DatosPlan {
    constructor(
        public ListaPlanes?: Plan[],
        public DetalleRemesa?: DetalleRemesa,
        public Bancos?: DatosBancoContrato[],
        public CantidadContratos?: number,
        public Descuento?: DescuentoEntity[],
        public DescuentoVT?: number,
        public Seguro?: SeguroCampesinoEntity
    ) { }
}

export class SeguroCampesinoEntity {
    constructor(
        public SeguroCampesino?: number,
        public SeguroCampesinoRet?: number,
        public Cerror?: string
    ) { }
}

export class DatosRenovacion {
    constructor(
        public PlanesTitularFechaFin?: Date,
        public Cobranza?: boolean
    ) { }
}

export class DatosMaternidad {
    constructor(
        public contratoKey?: ContratoKey,
        public beneficiario?: BeneficiarioList,
        public TipoMovimiento?: string
    ) { }
}

export class DatosTransaccion {
    constructor(
        public EstadoTransaccion?: boolean,
        public Mensaje?: string,
        public ContratoKey?: ContratoKey

    ) { }
}

export class DatosEmisionTarjetas {
    constructor(
        public Valor?: number,
        public BeneficiariosHijos?: number
    ) { }
}

export class FilterEmisionTarjetas {
    constructor(
        public Beneficiarios?: BeneficiarioList[],
        public Contrato?: ContratoKey
    ) { }
}

export class DatosModificaBeneficiarios {
    constructor(
        public ListaRelacion?: Relacion[],
        public Descuento?: number,
        public Servicios?: ServiciosContratoEntity[],
        public ListaServicios?: ServiciosEntity[],
        public PrecioBasePlan?: number,
        public ListaPersonas?: BeneficiarioList[],
        public Vida1Valor?: string,
        public Vida2Valor?: string,
        public MuerteAccidentalValor?: string,
        public DetalleHelponeValor?: PrecioServicioEntity
    ) { }
}

export class DatosValidacionDocumento {
    constructor(
        public Persona?: BeneficiarioList,
        public Negativa?: boolean,
        public PantallaPersonaUnica?: number
    ) { }
}

export class DatosCreaServicioBeneficiario {
    constructor(
        public ContratoKey?: ContratoKey,
        public Servicio?: ServiciosContratoEntity
    ) { }
}

export class DatosFacturacionManual {
    constructor(
        public ContratoKey?: ContratoKey,
        public DetalleRemesa?: DetalleRemesaCuotas
    ) { }
}

export class DatosCorrespondencia {
    constructor(
        public Correspondencia?: CorrespondenciaEntity,
        public Ciudades?: Catalogo[],
        public Persona?: PersonaUnicaEntity
    ) { }
}

export class ReversarTarjetaFilter {
    constructor(
        public DatoAnterior?: string,
        public Region?: string,
        public CodigoProducto?: string,
        public NumeroContrato?: number,
        public PersonaNumero?: number,
        public ValorTarejetasAdicionales?: number,
        public TarjetasAdicionales?: number,
        public CobrandoTarjetasAdicionales?: boolean,
        public NumeroMovimiento?: number
    ) { }
}


export class TransaccionQuitarCarencias {
    constructor(
        public Region?: string,
        public CodigoProducto?: string,
        public ContratoNumero?: number,
        public NumeroPersona?: number,
        public CodigoPlan?: string,
        public VersionPlan?: number,
        public CodigoContrato?: number,
        public CodigosCoberturas?: CoberturaCarencia[]
    ) { }

}

export class DatosContratoTransaccionBeneficiarioEntity {
    constructor(
        public NumeroPersona?: number,
        public CodigoProducto?: string,
        public CodigoContrato?: number,
        public CodigoRegion?: string,
        public NumeroContrato?: number
    ) { }
}

export class DatosAplicarDescuentoBeneficiarioEntity {
    constructor(
        //
        public CodigoRegion?: string,
        public CodigoProducto?: string,
        public NumeroContrato?: number,
        public NumeroEmpresa?: string,
        public PorcentajeDescuento?: number,
        public NombreSolicitante?: string,
        public NombreSucursalEmpresa?: string,
        public CodigoSucursal?: number,
        public NumeroSucursal?: string,
        public PersonaNumero?: number,
        public CodigoContrato?: number,

        public PrecioBeneficiario?: number,
        public ValorDescuento?: number,
        public PrecioServicio?: number,
        public AppDescuentoNuevo?: number,
        public AppValorDescuentoNuevo?: number,
        public VistaPorcentajeDescNuevo?: number,
        public VistaValorDescNuevo?: number

    ) { }
}


