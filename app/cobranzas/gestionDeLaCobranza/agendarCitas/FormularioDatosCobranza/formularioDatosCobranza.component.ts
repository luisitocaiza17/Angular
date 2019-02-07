import { Component, ElementRef, OnInit, OnDestroy } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { utilidadesGenericasService } from "../../../../utils/utilidadesGenericas";
import { CitaCliente } from "../../../../common/model/cobranzas";
import { ContratoKey } from "../../../../common/model/contrato";
import { DatosCorrespondencia, TransaccionKey } from "../../../../common/model/transacciones";
import { DetalleRemesa } from "../../../../common/model/detalleRemesa";
import { DetalleRemesaService } from "../../../../common/servicios/detalleRemesa.service";
import { GenericosService } from "../../../../common/servicios/genericos.service";
import { SucursalDeRegion } from "../../../../common/model/genericos";
import { CobranzaService } from "../../../../common/servicios/cobranza.service";
import { AuthService } from "../../../../seguridad/auth.service";
import { BusquedaContratosComponent } from "../busquedaContratos/busquedaContratos.component";

@Component({
    selector: 'formularioDarosCobranza',
    providers: [GenericosService, CobranzaService],
    templateUrl: 'formularioDatosCobranza.template.html'
})

export class FormularioDatosCobranza implements OnInit, OnDestroy { 

    CitaCliente: CitaCliente; 
    Texto: String; 
    datepickerOpts: {}; 
    subscription: any; 
    contratoKey: ContratoKey; 
    datosCorrespondencia: DatosCorrespondencia; 
    transactionKey: TransaccionKey; 
    optionsForDireccionCita: string[]; 
    detallesRemesa: DetalleRemesa[]; 
    sucursalesDeRegion: SucursalDeRegion[]; 
    fechaHoy: Date; 
    currentTime: string; 
    telefonos: string; 
    mesesEnPantalla: string; 
    individualOGrupal: string; 

    constructor(
        public domSanitizer: DomSanitizer, 
        private authService: AuthService, 
        private elementRef: ElementRef, 
        public utilidadesGenericas: utilidadesGenericasService, 
        private busquedaContratosComponent: BusquedaContratosComponent, 
        private detalleRemesaService: DetalleRemesaService, 
        private genericosService: GenericosService, 
        private cobranzaService: CobranzaService
    ){ 
        this.datepickerOpts = Object.assign({},this.utilidadesGenericas.datepickerOpts);
    }

    ngOnInit() { 
        this.CitaCliente = new CitaCliente(); 
        this.optionsForDireccionCita = [];
        this.sucursalesDeRegion = []; 
        this.mesesEnPantalla = ''; 
        this.CitaCliente.RealizadoPor = this.authService.nombreUsuario; 
        this.fechaHoy = this.utilidadesGenericas.getTodayDate(); 
        this.transactionKey = new TransaccionKey(); 
        this.detallesRemesa = []; 
        this.loadDataFromParent(); 
    }

    loadDataFromParent(){ 
        this.contratoKey = new ContratoKey(); 
        this.subscription = this.busquedaContratosComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined) {
                    if (!contratoKey.unsuscribe) {
                        this.contratoKey = contratoKey; 
                        this.telefonos = this.contratoKey.Celular + " / " + this.contratoKey.DomicilioTelefono1 + " / " + this.contratoKey.DomicilioTelefono2;   
                        this.CitaCliente.Direccion1 = this.contratoKey.DomicilioCalle; 
                        this.CitaCliente.Direccion2 = this.contratoKey.TrabajoCalle; 
                        this.CitaCliente.Direccion3 = this.contratoKey.CalleCorrespondencia;                          
                        this.CitaCliente.Observacion = this.contratoKey.Observaciones; 
                        this.CitaCliente.Contacto = this.contratoKey.NombreDuenioCuenta; 
                        this.CitaCliente.FechaCita = new Date(); 
                        this.CitaCliente.Estado = this.contratoKey.ContratoCodigoEstado; 
                        this.CitaCliente.NumC = this.contratoKey.NumeroContrato; 
                        this.CitaCliente.Region = this.contratoKey.CodigoRegion;                  
                        this.currentTime = this.utilidadesGenericas.getCurrentTimeHoursMinutesFormat(); 
                        this.CitaCliente.Hora = this.utilidadesGenericas.getCurrentTimeAddingHours(2); 
                        this.CitaCliente.Tipo = this.contratoKey.buscaPorCuenta == true ? 'Cuenta' : 'Contrato'; 
                        this.generateOptionsForDireccionCita();   
                        this.CitaCliente.DireccionCita = this.optionsForDireccionCita[0];                   
                        this.loadDetallesRemesas(contratoKey); 
                        this.setearSiContratoEsGrupalOIndividual(contratoKey); 
                        this.loadSucursalesDeRegion(contratoKey);                    
                        this.CitaCliente.Sector = this.utilidadesGenericas.sectores[0].value; 
                    } else {
                        this.ngOnDestroy();
                    }
                }
            }
        );
    }

    generateOptionsForDireccionCita() { 

        if(this.CitaCliente.Direccion1 != null && this.CitaCliente.Direccion1 != undefined)
            this.optionsForDireccionCita.push(this.CitaCliente.Direccion1); 

        if(this.CitaCliente.Direccion2 != null && this.CitaCliente.Direccion2 != undefined)
            this.optionsForDireccionCita.push(this.CitaCliente.Direccion2); 
        
        if(this.CitaCliente.Direccion3 != null && this.CitaCliente.Direccion3 != undefined)
            this.optionsForDireccionCita.push(this.CitaCliente.Direccion3); 
    }

    loadDetallesRemesas(contratoKey: ContratoKey) { 
        this.detalleRemesaService.getDetallesRemesasEnMora(contratoKey)
                .subscribe( detallesRemesa => { 
                        this.detallesRemesa = detallesRemesa; 
                        this.setMontoMora(); 
                        this.setNumeroDeMesesEnMoraYDetalleMesesEnMora(); 
                    }, 
                    error => { 
                        this.authService.showInfoPopup(error); 
                    } 
                ); 
    }

    setMontoMora() { 
        this.CitaCliente.Monto = 0; 
        this.detallesRemesa.forEach( dr => { 
            this.CitaCliente.Monto += dr.SaldoCuota; 
        });
        this.CitaCliente.MontoACobrar =this.CitaCliente.Monto; 
        this.CitaCliente.MontoMensual =this.CitaCliente.Monto;     
    }

    setNumeroDeMesesEnMoraYDetalleMesesEnMora() { 
        this.CitaCliente.MesesCobro = 0;
        this.CitaCliente.MesesDetalle = ''; 
        this.detallesRemesa.forEach( dr => { 
            if( dr.PeriodoPago.toUpperCase() == 'MENSUAL'){ 
                this.CitaCliente.MesesCobro += 1;
                var fechaDesde = new Date(dr.FacturadoDesde);
                this.setDetalleMesesEnMora(fechaDesde, 1);
            }
                
            if( dr.PeriodoPago.toUpperCase() == 'BIMENSUAL')
            {
                this.CitaCliente.MesesCobro += 2; 
                var fechaDesde = new Date(dr.FacturadoDesde);
                this.setDetalleMesesEnMora(fechaDesde, 2);
            }
               
            if( dr.PeriodoPago.toUpperCase() == 'TRIMESTRAL')
            {
                this.CitaCliente.MesesCobro += 3; 
                var fechaDesde = new Date(dr.FacturadoDesde);
                this.setDetalleMesesEnMora(fechaDesde, 3);
            }
                
            if( dr.PeriodoPago.toUpperCase() == 'CUATRIMESTRAL')
            {
                this.CitaCliente.MesesCobro += 4; 
                var fechaDesde = new Date(dr.FacturadoDesde);
                this.setDetalleMesesEnMora(fechaDesde, 4);
            }
                
            if( dr.PeriodoPago.toUpperCase() == 'SEMESTRAL')
            {
                this.CitaCliente.MesesCobro += 6; 
                var fechaDesde = new Date(dr.FacturadoDesde);
                this.setDetalleMesesEnMora(fechaDesde, 6);
            }
                
            if( dr.PeriodoPago.toUpperCase() == 'ANUAL'){
                this.CitaCliente.MesesCobro += 12; 
                var fechaDesde = new Date(dr.FacturadoDesde);
                this.setDetalleMesesEnMora(fechaDesde, 12);
            }
                
        });
    }

    setDetalleMesesEnMora(fechaDesde: Date, numeroMeses: number) { 
        
        for(var i = 0 ; i < numeroMeses; i++){ 
            if(this.mesesEnPantalla == '')
                this.mesesEnPantalla = this.utilidadesGenericas.getNombreMes(fechaDesde.getMonth() + i); 
            else
                this.mesesEnPantalla = this.mesesEnPantalla + ' ' + this.utilidadesGenericas.getNombreMes(fechaDesde.getMonth() + i);
        }
    }

    setearSiContratoEsGrupalOIndividual(contratoKey: ContratoKey) {
            if( this.contratoKey.NumeroEmpresa == '1' || this.contratoKey.NumeroEmpresa == '5000001'){
                this.CitaCliente.NombreCliente = contratoKey.NombresApellidos; 
                this.individualOGrupal = "Individual"; 
                this.CitaCliente.GrupalIndividual = "Individual"; 
            }              
            else{
                this.CitaCliente.NombreCliente = contratoKey.NombresApellidos; 
                this.individualOGrupal = "Grupal"; 
                this.CitaCliente.GrupalIndividual = "Grupal " + this.contratoKey.RazonSocial; 
            }
                
    }

    actualizarMesesACobrar(idOfElement: string) { 
    
        if($(idOfElement).is(':checked'))
        {
            this.CitaCliente.MesesACobrar++; 
            if(this.CitaCliente.MesesDetalle.trim() == '')
                this.CitaCliente.MesesDetalle = idOfElement.substring(1,4); 
            else
                this.CitaCliente.MesesDetalle = this.CitaCliente.MesesDetalle + ' ' + idOfElement.substring(1,4); 
        }
        else{ 
            this.CitaCliente.MesesACobrar--;
            this.CitaCliente.MesesDetalle = this.CitaCliente.MesesDetalle.replace(idOfElement.substring(1,4), ''); 
        }         
    }

    loadSucursalesDeRegion(contratoKey: ContratoKey) { 
        this.genericosService.getSucursalPorRegion(contratoKey) 
                .subscribe(
                    datos => { 
                        this.sucursalesDeRegion = datos; 
                        this.CitaCliente.CodigoSucursal = datos[0].CodigoSucursal; 
                    }
                ); 
    }

    insertarCitaCliente(){ 
        this.cobranzaService.insertCitaCliente(this.CitaCliente)
                .subscribe( res => { 
                    this.authService.showSuccessPopup(res); 
                }, 
                error => { this.authService.showErrorPopup(error); } 
            ); 
    }

    ngOnDestroy() { 
        if (this.subscription != undefined)
        this.subscription.unsubscribe();
    }



}