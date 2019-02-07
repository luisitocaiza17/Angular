export class DetalleMontoFactura {
	constructor(
		public MedicinaPrepagada?: number,
		public ServiciosAdicionales?: number,
		public Subtotal1?: number,
		public Descuento?: number,
		public Subtotal2?: number,
		public GastosAdministrativos?: number,
		public Subtotal3?: number,
		public SeguroCampesino?: number,
		public Total?: number
	) { }
}