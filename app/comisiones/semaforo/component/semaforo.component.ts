import { Component, OnInit } from "@angular/core";
import { Semaforo } from "../model/semaforo";
import { SemaforoService } from "../service/semaforo.service";
import { AuthService } from "../../../seguridad/auth.service";
import { ConstantesComisiones } from "../../utils/ConstantesComisiones";

@Component({
  providers: [],
  templateUrl: 'semaforo.template.html'
})
export class SemaforoComponent implements OnInit {
  tipoSemaforos: string[];
  semaforos: Semaforo[];
  tipoSemaforo: string;
  constructor(public servicioSemafaro: SemaforoService, public authService: AuthService, private constantes: ConstantesComisiones) {

  }

  ngOnInit() {
    this.tipoSemaforo ="";
    this.servicioSemafaro.getTipoSemaforos().subscribe(tipoSemaforos => {
      this.tipoSemaforos = tipoSemaforos;
    }, error => {
      this.authService.showErrorPopup("Ha ocurrido un Error");
    });
  }

  editarSemaforo(tipo: string, modalName:string): void {
    if (tipo == this.constantes.SEMAFORO_CUOTA_1) {
      this.servicioSemafaro.getSemaforosByTipo(this.constantes.TIPO_SEMAFORO_CUOTA_1).subscribe(semaforos=>{
        this.semaforos = semaforos;
        this.tipoSemaforo = this.semaforos[0].TipoSemaforo;
      }, error => {
        this.authService.showErrorPopup("Ha ocurrido un Error");
      });
    } else if(tipo == this.constantes.SEMAFORO_GESTION_VENTA) {
      this.servicioSemafaro.getSemaforosByTipo(this.constantes.TIPO_SEMAFORO_GESTION_VENTA).subscribe(semaforos=>{
        this.semaforos = semaforos;
        this.tipoSemaforo = this.semaforos[0].TipoSemaforo;
      }, error => {
        this.authService.showErrorPopup("Ha ocurrido un Error");
      });
    }
    
    $(modalName).modal();
    
  }

  salir() {
    $('#modalEditar').modal('hide');

  }


  guardarSemaforo():void{
    let indice = 1;
    let estadoValidacion = 0;
    let elementoDesde = 0;
    let elementoHasta = 0;
    let auxDesde = 0;
    this.semaforos.forEach(element => {
      elementoDesde = element.Desde;
      elementoHasta = element.Hasta;
      if(indice <   this.semaforos.length){
        auxDesde =   this.semaforos[indice].Desde - 0.01;
        if(elementoDesde < elementoHasta && auxDesde == elementoHasta){
          indice ++;  
          estadoValidacion ++;  
        }
      }else{
        if(elementoDesde < elementoHasta){
          indice ++;  
          estadoValidacion ++;  
        }
      }
       
    });
    if(estadoValidacion == 3){
      this.servicioSemafaro.actualizarSemaforo(this.semaforos).subscribe(() =>{
        this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
        this.salir();
      });
    }else{
      this.authService.showErrorPopup("Error, por favor revise los valores");
    }
  }
}