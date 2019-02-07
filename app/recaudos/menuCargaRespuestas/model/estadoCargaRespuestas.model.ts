export class ConfiguracionCargaBancoEntity
{ 
    constructor(
        public CodigoBanco?: number, 
        public LugarPago?: string, 
        public TipoPago?: string, 
        public BancoCaja?: number, 
        public TarjetaCodigoBanco?: number, 
        public ProcesoRecaudacion?: string, 
        public PrefijoIdRecaudacion?: string, 
        public PalabraConfirmacion?: string, 
        public SeparadorDecimal?: string,
        public NroColumnasArchivo?: number,
        public PosicionContrato?: number, 
        public PosicionProducto?: number, 
        public PosicionRegion?: number, 
        public PosicionNroCuota?: number, 
        public PosicionNroRemesa?: number,
        public PosicionNroLineaRemesa?: number, 
        public PosicionValor?: number, 
        public PosicionFechaAcredBanco?: number,
        public PosicionRefBancaria?: number,
        public PosicionPalabraConfirmacion?: number      
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