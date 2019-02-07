export class ComisionNovedadGenerico { 
	constructor(
		public Id?: number,
		public CodigoTransaccion?: number,
		public CodigoProducto?: string,
		public ContratoNumero?: number,
		public Region?: string,
		public FechaMovimiento?: Date,
		public PersonaNumero?: number,
		public CodigoServicio?: number,
		public PrecioCalculo?: number,
		public Comisiona?: boolean,
		public FechaNovedad?: Date,
		public Usuario?: string,
		public Observacion?: string
	){ }
}