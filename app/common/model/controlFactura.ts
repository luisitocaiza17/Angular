export class ControlFacturaFilter{
    constructor(
        public NumeroFactura?: number,
        public OfSerie?: number,
        public SerieFactura?: number,
        public TipoDocumento?: string,
        public Region?: string,
        public CodigoProducto?: string,
        public ContratNumero?: number,
        public NumeroCuota?: number,
        public EstadoFactura?: number,
        public FechaImpresionDesde?: Date, 
        public FechaImpresionHasta?: Date, 
        public TipoEmision?: string, 
        public Ordenamiento?: string
    ){

    }
}