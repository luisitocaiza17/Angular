import { IndicadorPersistencia } from "./indicadorPersistencia";
import { IndicadorGestionVentas } from "./IndicadorGestionVentas";
import { IndicadorCuotaUno } from "./indicadorCuotaUno";

export class IndicadoresVendedor {
	constructor(
		public Id?:number,
		public CodigoAgenteVenta?: number,
		public Mes?: number,
		public Anio?: number,
		public IndicadorPersistencia?: IndicadorPersistencia,
		public IndicadorGestionVentas?: IndicadorGestionVentas,
		public IndicadorCuotaUno?: IndicadorCuotaUno
	){ }
}