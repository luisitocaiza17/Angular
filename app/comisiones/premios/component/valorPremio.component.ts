import { Component, OnInit } from '@angular/core';
import { ValorPremio } from '../model/ValorPremio';
import { ValorPremioService } from '../service/ValorPremio.service';
import { AuthService } from '../../../seguridad/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './valorPremio.component.html'
})
export class ValorPremioComponent implements OnInit {

  valorPremio: ValorPremio;
  listaValoresPremio: ValorPremio[];
  idPremio: number;

  constructor(private valorPremioService: ValorPremioService, private authService: AuthService, private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.recuperarParametros();
    this.limpiar();
    this.listaValoresPremio = [];
  }

  crearValorPremio() {
    this.valorPremioService.validarValorPremio(this.valorPremio).subscribe((result) => {
      console.log(result)
      if (!result) {
        this.valorPremioService.createValorPremio(this.valorPremio).subscribe((res) => {
          this.authService.showSuccessPopup("Registro ingresado Exitosamente");
          this.limpiar();
        }, err => {
          this.authService.showErrorPopup("No se pudo guardar el Valor");
        });
        
      }else{
        this.authService.showErrorPopup("El valor ingresado ya existe");
      }
    }, err => {
      this.authService.showErrorPopup("Ocurrio un Error");
    });
  }

  cargarValorPremio() {
    this.valorPremioService.getAllValorPremio(this.valorPremio.IdDetallePremio).subscribe((res) => {
      this.listaValoresPremio = res;
    });
  }

  recuperarParametros() {
    this.valorPremio = new ValorPremio();
    this.idPremio = this.activatedRoute.snapshot.params['idPremio'];
    this.valorPremio.IdDetallePremio = this.activatedRoute.snapshot.params['idDetalle'];
  }

  borrarValorPremio(valorPremio) {
    valorPremio.Estado = false;
    this.valorPremioService.deleteValorPremio(valorPremio).subscribe((res) => {
      if (res) {
        this.authService.showSuccessPopup("Registro borrado exitosamente");
        this.cargarValorPremio();
      }
    }, error => {
      this.authService.showErrorPopup("No se puedo borrar el valor");
    });
  }

  limpiar() {
    this.cargarValorPremio();
  }
}
