import { Injectable } from "@angular/core";
import { Mes } from "../consultasComisiones/model/mes";
import { ConstantesComisiones } from "./ConstantesComisiones";

@Injectable()
export class UtilsComponent {

	constructor(private constants: ConstantesComisiones) { }

	obtenerAnios(): number[] {
		let anioInicial = this.constants.ANIO_INICIAL_COMISIONES;
		let anioActual = new Date().getFullYear();
		let anios = [];
		for(let i = anioInicial; i <= anioActual; i++) {
			anios.push(i);
		}

		return anios;
	}

	obtenerMeses(): Mes[] {
		let meses = [];
		for(let i = 1; i <= 12; i++) {
			let mes = new Mes();
			mes.Numero = i;
			mes.Nombre = this.obtenerNombreMes(i);	
			meses.push(mes);
		}

		return meses;
	}
	
	obtenerNombreMes(numeroMes: number): string {
		let nombreMes = "";
		switch (numeroMes) {
			case 1:
				nombreMes = "Enero";
				break;
			case 2:
				nombreMes = "Febrero";
				break;
			case 3:
				nombreMes = "Marzo";
				break;
			case 4:
				nombreMes = "Abril";
				break;
			case 5:
				nombreMes = "Mayo";
				break;
			case 6:
				nombreMes = "Junio";
				break;
			case 7:
				nombreMes = "Julio";
				break;
			case 8:
				nombreMes = "Agosto";
				break;
			case 9:
				nombreMes = "Septiembre";
				break;
			case 10:
				nombreMes = "Octubre";
				break;
			case 11:
				nombreMes = "Noviembre";
				break;
			case 12:
				nombreMes = "Diciembre";
				break;
		}
		return nombreMes;
	}
}