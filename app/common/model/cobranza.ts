export class CobranzaFilter {
    constructor(
        public CodigoContrato?: number
    ) { }
}

export class Cobranza {
    constructor(
        // listado
        public Numero?: number,
        public FechaInicio?: string,
        public FechaFin?: string,
        public ValorMensual?: number,
        public ValorServicios?: number,
        public ValorRecargo?: number,
        public NombreDuenioCuenta?: string,
        public FacturarCedula?: number,
        public FacturarRuc?: string,
        public FormaPago?: number,
        public NumeroCuenta?: number,
        public Banco?: number,
        public TipoCuenta?: number,
        public PeriodoPago?: string,
        public NumeroContratoDebito?: number
    ) { }
}

export class ReciboCobranzaPdfIndividual{ 
    constructor(
        public ContratoNumero?: number,
        public Region?: string, 
        public CodigoProducto?: string, 
        public NumeroCuota?:  number,
        public ValorAFavor?: number,
        public AFavorContrato?: number, 
        public FechaDesde?: Date, 
        public FechaHasta?: Date, 
        public Cuenta?: string, 
        public Empresa?: number, 
        public Periodo?: string, 
        public FechaPago?: Date, 
        public Impreso?: number, 
        public DuenioCuenta?: string, 
        public FacturadoARuc?: string, 
        public FacturadoACedula?: string,
        public FacturadoAPasaporte?: string, 
        public CalleCorrespondencia?: string,
        public FechaInicioContrato?: Date, 
        public FechaFinContrato?: Date, 
        public TipoCuenta?: number,
        public ValorCuota?: number, 
        public EsCopia?: boolean
    ){ }
}
