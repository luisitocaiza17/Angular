export class IndicadorGestionVentas {
	constructor(
		public Id?: number,
		public TotalTransacPositivas?: number,
		public TotalPresupuestoMinimo?: number,
		public ValorGestionVentas?: number,
		public Semaforo?: number,
		public IdIndicadorVendedor?: number,
		public DescripcionSemaforo?: string
	) { }
}