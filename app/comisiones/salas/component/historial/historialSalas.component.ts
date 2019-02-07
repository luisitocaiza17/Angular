import { Component, OnInit } from '@angular/core';
import { SalasService } from '../../service/salas.service';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { AuthService } from '../../../../seguridad/auth.service';
import { AutorizacionService } from '../../../../common/servicios/autorizacion.service';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PaginationService } from 'ngx-pagination';
import { HistorialSala } from '../../model/HistorialSala';
import { SalasComponent } from '../ingresar/salas.component';
import { ConsultarSalasComponent } from '../consultar/consultarSalas.component';
@Component({
  selector: 'app-historialSalas',
  templateUrl: './historialSalas.component.html'
})
export class HistorialSalasComponent extends PaginationService implements OnInit {

  listaHistorial:HistorialSala;
  id:number;

  constructor(private authService: AuthService,
    public salasService: SalasService, private autorizacionService: AutorizacionService, private consultarSala:ConsultarSalasComponent) {
    super();
    this.listaHistorial = new HistorialSala();
    this.id = 0;
  }


  ngOnInit() {
    this.consultarSala.selectSala$.subscribe((resultado)=>{
      if (resultado != undefined) 
      {
        this.id = resultado.Codigo;
        this.consultar();
      }
      
    });

  }

  openModal(modalName: string) {
    $(modalName).modal();
  }

  consultar(): void {
   this.salasService.consultarHistorial(this.id).subscribe((result)=>{
      this.listaHistorial = result;
   });
  }

  salir() {
    $('#modalHistorial').modal('hide');
  }
}
