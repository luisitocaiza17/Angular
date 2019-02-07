import { Component, OnInit, Input } from '@angular/core';
import { ContratoKey, ClaveContratoEntity } from '../../../../../common/model/contrato';
import { IndividualEntitiy } from '../model/IndividualEntity';
import { IndividualesService } from '../../service/individuales.service';
import { AuthService } from '../../../../../seguridad/auth.service';
import { ContratosTxListComponent } from '../../../../contratosTx.list.component';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html'
})
export class VentaFamiliarComponent implements OnInit {

  _contratoKey: ContratoKey;
  filter: ClaveContratoEntity;
  referidorIndividual:IndividualEntitiy;
  auxVista: IndividualEntitiy;
  estadoObligatorio: boolean;
  @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined) {
            this.filter.CodigoProducto = this._contratoKey.CodigoProducto;
            this.filter.Region = this._contratoKey.CodigoRegion;
            this.filter.NumeroContrato = this._contratoKey.NumeroContrato;
            //this.loadDatos();
        }
        else {
            this._contratoKey = new ContratoKey();
        }
    }

  constructor(public individualService:IndividualesService,  private authService: AuthService) { 
    this.referidorIndividual = new IndividualEntitiy();
    this._contratoKey = new ContratoKey();
    this.filter = new ClaveContratoEntity();
    this.auxVista = new IndividualEntitiy();
    this.estadoObligatorio = false;
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

  ngOnInit() {
    this.individualService.obtenerIndividuales(this.filter).subscribe(
      (result)=>{
        this.auxVista = result;
    });
  }

  limpiar(){
    this.referidorIndividual =new IndividualEntitiy();
  }

  guardarIndividuales(){
    this.referidorIndividual.Region = this._contratoKey.CodigoRegion;
    this.referidorIndividual.CodigoProducto = this._contratoKey.CodigoProducto;
    this.referidorIndividual.ContratoNumero = this._contratoKey.NumeroContrato;
    this.referidorIndividual.NumeroEmpresa = this._contratoKey.NumeroEmpresa;
    this.referidorIndividual.NumeroSucursal = +this._contratoKey.NumeroSucursal;
    this.referidorIndividual.NumeroPersona = this._contratoKey.NumeroPersona;
    this.referidorIndividual.CodigoContrato = this._contratoKey.CodigoContrato;

    this.individualService.actualizarIndividuales(this.referidorIndividual).subscribe((result)=>{
        this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
      },
      error => this.authService.showErrorPopup(error)
    );
    this.limpiar();
  }
  
}
