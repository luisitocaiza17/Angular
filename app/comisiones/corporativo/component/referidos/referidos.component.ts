import { Component, OnInit, Input } from '@angular/core';
import { CorporativoReferidoEntity } from '../../model/corporativoReferidoEntity';
import { CorporativoService } from '../../services/corporativo.service';
import { BusquedaComponent } from '../busqueda/busqueda.component';
import { AuthService } from '../../../../seguridad/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-referidos',
  templateUrl: './referidos.component.html'
})
export class ReferidosComponent implements OnInit {


  estadoObligatorio: boolean;


  @Input() message: CorporativoReferidoEntity;


  referidorCorporativo: CorporativoReferidoEntity;
  constructor(private authService: AuthService, private corporativoService: CorporativoService, public busquedaCorporativo: BusquedaComponent,
    public route: ActivatedRoute,
    public router: Router) {
    this.referidorCorporativo = new CorporativoReferidoEntity();
    this.estadoObligatorio = false;
  }

  ngOnInit() {
  }

  noFamiliar() {
    this.estadoObligatorio = false;
  }

  siFamiliar() {
    this.estadoObligatorio = false;
  }

  noCompetencia() {
    this.estadoObligatorio = false;

  }

  siCompetencia() {
    this.estadoObligatorio = true;

  }

  guardarCorporativo() {
    this.busquedaCorporativo.selectPlan$.subscribe((result) => {
      this.referidorCorporativo.EmpresaNumero = result.EmpresaNumero;
      this.referidorCorporativo.SucursalEmpresa = result.SucursalEmpresa;
      this.referidorCorporativo.PorcentajeDirectorReferidor = result.PorcentajeDirectorReferidor;
      this.referidorCorporativo.PorcentajeReferidor = result.PorcentajeReferidor;
    });
    this.corporativoService.actualizarContratos(this.referidorCorporativo).subscribe((result) => {
      if (result) {
        this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
      } else {
        this.authService.showInfoPopup("Vuelva a internarlo");
      }

    },
      error => this.authService.showErrorPopup(error)
    );
    this.router.navigate(['/#/mainView']);

  }
}
