import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../seguridad/auth.service";
import { ContratoPCAService } from "../services/contratoPCA.services";

@Component({
	providers: [],
	templateUrl: 'contratoPCA.template.html'
})

export class ContratoPCAComponent {

	archivo: File;

	constructor(private authService: AuthService, private contratoPCAService: ContratoPCAService) { }

	uploadFileToActivity(files: FileList) {
		this.archivo = null;
		this.archivo = files.item(0);
	}

	cargarArchivo(): void {
		if (this.archivo != null) {
			this.contratoPCAService.cargarArchivo(this.archivo).subscribe(() => {
				this.authService.showSuccessPopup('Archivo cargado correctamente');
			}, error => this.authService.showErrorPopup(error));
		} else {
			this.authService.showErrorPopup('Debe cargar un archivo.');
		}
	}
}