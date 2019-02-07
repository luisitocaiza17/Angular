import { Component, OnInit, OnDestroy } from '@angular/core';
import { menuGenerarArchivosDebitosInstitucionesComponent } from '../menuGenerarArchivosDebitosInstituciones.component';
import { BancoEntity } from '../../../common/model/genericos';
import { EnvioDebitosInstitucionesService } from '../../services/envioDebitosInstituciones.service';
import { RemesaEntity } from '../../../common/model/remesa';
import { AuthService } from '../../../seguridad/auth.service';
import { RecaudosState } from '../../services/reacuados.state';
import { BehaviorSubject, Observable } from 'rxjs';
import { ISubscription } from 'rxjs/Subscription';
import { DetalleRemesa } from '../../../common/model/detalleRemesa';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'consultaDetallesRemesa',
    providers: [DatePipe],
    templateUrl: 'consultaDetallesRemesa.component.html', 
    styleUrls: ['consultaDetallesRemesa.component.css']
})

export class ConsultaDetallesRemesaComponent implements OnInit, OnDestroy {

    bancoSelected: BancoEntity;
    detallesRemesa: DetalleRemesa[]; 
    numeroRemesa: number; 
    registrosTotales: number; 
    remesaSelected: RemesaEntity; 
    subscription: ISubscription;

    constructor( 
        public envioDebitosInstitucionesService: EnvioDebitosInstitucionesService, 
        private authService: AuthService, 
        private recaudosState: RecaudosState, 
        private datePipe: DatePipe
    ) { 
        this.detallesRemesa = []; 
    }

    tableSettings = {
        columns: {
          NumeroLineaRemesa: {
            title: 'Numero Linea', 
            compareFunction:(direction: any, a: any, b: any) => {
               return this.ordernarNumerosEnteros(direction, a, b); 
            }     
          },
          Region: {
            title: 'Región'
          },
          CodigoProducto: {
            title: 'Producto'
          },
          ContratoNumero: {
            title: 'Contrato'
          }, 
          NumeroCuota: {
            title: 'Cuota',
            compareFunction:(direction: any, a: any, b: any) => {
                return this.ordernarNumerosEnteros(direction, a, b); 
            }
          },
          FacturadoHasta: {
            title: 'Facturado Hasta',
            valuePrepareFunction: (date) => { 
                var raw = new Date(date);
        
                var formatted = this.datePipe.transform(raw, 'dd/MM/yyyy');
                return formatted; 
            }
          }, 
          ValorCuota: {
            title: 'Valor Cuota',
            compareFunction:(direction: any, a: any, b: any) => {
                return this.ordernarNumerosDecimales(direction, a, b); 
            }
          }, 
          ValorRemitido: {
            title: 'Valor Remitido',
            compareFunction:(direction: any, a: any, b: any) => {
                return this.ordernarNumerosDecimales(direction, a, b); 
            }
          }, 
          EstadoRemesa: {
            title: 'Estado',
            compareFunction:(direction: any, a: any, b: any) => {
                return this.ordernarNumerosEnteros(direction, a, b); 
            }
          }, 
          NumeroCuenta: {
            title: 'Cuenta',
            compareFunction:(direction: any, a: any, b: any) => {
                return this.ordernarNumerosEnteros(direction, a, b); 
            }
          }, 
          FacturadoA: {
            title: 'Facturado a'
          }, 
          NombreDuenioCuenta: {
            title: 'Dueño Cuenta', 
            width: '500px'
          }
        }, 
        actions: {
            add: false, 
            edit: false, 
            delete: false, 
            position: false
        }, 
        pager: {
            perPage: 20
        }, 
        attr: {
            class: 'table table-bordered'
        }
    };

    private remesasObs: BehaviorSubject<RemesaEntity[]> = new BehaviorSubject<RemesaEntity[]>(null);
    remesa$: Observable<RemesaEntity[]> = this.remesasObs.asObservable();

    ngOnInit(){ 
        this.subscription = this.recaudosState.remesaSelelected$
                .subscribe(
                    remesa => { 
                        this.remesaSelected = remesa; 
                        if(this.remesaSelected != undefined){
                            this.GetDetallesRemesa(); 
                        }
                    }
                ); 
    }

    ordernarNumerosEnteros(direction: any, a: any, b: any){
        let first = typeof a === 'string' ? Number(a) : a;
        let second = typeof b === 'string' ? Number(b) : b;

        if (first < second) {
            return -1 * direction;
        }
        if (first > second) {
            return direction;
        }
        return 0;
    }

    ordernarNumerosDecimales(direction: any, a: any, b: any){
        let first = typeof a === 'string' ? Number(a.replace(",",".")) : a;
        let second = typeof b === 'string' ? Number(b.replace(",",".")) : b;

        if (first < second) {
            return -1 * direction;
        }
        if (first > second) {
            return direction;
        }
        return 0;
    }

    GetDetallesRemesa(){ 
        this.envioDebitosInstitucionesService.GetDetallesRemesa(this.remesaSelected.NumeroRemesa)
                .subscribe(
                    res => { 
                        this.detallesRemesa = res;
                        this.registrosTotales = this.detallesRemesa.length;
                    }, 
                    error => { this.authService.showErrorPopup(error) }
                ); 
    }
    
    setearNumeroRemesa() { 
        this.numeroRemesa = this.recaudosState.getRemesaSelected().NumeroRemesa;
    }

    ngOnDestroy(){
        this.subscription.unsubscribe(); 
    }

}