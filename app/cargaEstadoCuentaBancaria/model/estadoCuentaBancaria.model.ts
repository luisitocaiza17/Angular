export class ConfiguracionCargaEstadoCuentaEntity
{ 
    constructor(
        public CodigoBanco?: number, 
        public TieneCabeceras?: boolean, 
        public FormatoArchivo?: string, 
        public SeparadorColumnas?: string, 
        public CaracteresAEliminar?: string[], 
        public SeparadorDecimales?: string, 
        public SeparadorMiles?: string, 
        public PosicionFecha?: number, 
        public PosicionDocumento?: number, 
        public PosicionSaldo?: number, 
        public PosicionCodigo?: number, 
        public PosicionConcepto?: number, 
        public PosicionTipo?: number, 
        public PosicionMonto?: number, 
        public IdentificadorCredito?: string,
        public CodigoFormatoFecha?: number
    ){

    }
}

export class ColumnaBdd
{
    constructor(
        public Nombre?: string, 
        public TipoDato?: string
    ){

    }
}