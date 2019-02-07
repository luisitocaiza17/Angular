import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';


import { EmpresaCoorporativo, CorporativoFilter,  CorporativoList } from '../common/model/corporativo';

import { AuthService } from '../seguridad/auth.service';
import { CorporativoService } from '../common/servicios/corporativo.service';
import { Sucursal, SucursarList } from '../common/model/sucursal';


@Component({
    providers: [CorporativoService],
    templateUrl: 'corporativo.template.html'
})

export class CorporativoComponent implements OnInit {

    corporativo: EmpresaCoorporativo;
    corporativos: EmpresaCoorporativo[];
    sucursal: Sucursal;
    sucursales: Sucursal[];
    filter: CorporativoFilter;
    filtroSuc: CorporativoFilter;
    sucursalkey: SucursarList;

    isDesplegar: boolean;

    private CorporativoKey: BehaviorSubject<CorporativoList> = new BehaviorSubject<CorporativoList>(null);
    selectCorporativo$: Observable<CorporativoList> = this.CorporativoKey.asObservable();
    private SucursalKey: BehaviorSubject<SucursarList> = new BehaviorSubject<SucursarList>(null);
    selectSucursal$: Observable<SucursarList> = this.SucursalKey.asObservable();

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private corporativoService: CorporativoService, private sucursalservice: CorporativoService) {
    }



    ngOnInit(): void {
        this.corporativos = [];
        this.sucursales = [];
        this.filter = new CorporativoFilter();
        this.consultar();
        this.corporativoService.getRoles();
    }


    loadData(corporativo: EmpresaCoorporativo[]): void {
        this.corporativos = corporativo;
    }

    consultar(): void {
        this.corporativoService.resetDefaultPaginationConstanst();
        this.buscar();

    }

    colapsarTab(): void {
        this.isDesplegar = false;
        var key = new CorporativoList();
        // key.unsuscribe = true;
        this.CorporativoKey.next(key);
    }

    pageChanged(): void {
        this.buscar();
    }


    buscar(): void {
        this.corporativoService.getByFiltersPaginated(this.filter)
            .subscribe(corporativo => {
                this.loadData(corporativo);
                if (corporativo != undefined && corporativo.length > 0) {
                    var inipos = jQuery("#ResultadoBusquedaCorporativo").position().top;
                    jQuery("html, body").animate({ scrollTop: inipos + 190 }, 300);
                }
            },
                error => this.authService.showErrorPopup(error));
    }


    limpiar(): void {
        this.corporativoService.resetDefaultPaginationConstanst();
        this.filter = new CorporativoFilter();
        this.buscar();
    }



    inicializarPanelCorporativo(selected: EmpresaCoorporativo): void {
        this.isDesplegar = true;
        this.chRef.detectChanges();
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelCorporativo").collapse("show");
        this.crearCorporativoKey(selected);


        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelCorporativo").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();

    }

    crearCorporativoKey(selected: EmpresaCoorporativo): void {
        var key = new CorporativoList();
        key = selected;
        /*key.Numero = selected.Numero;
        key.Nombre = selected.Nombre;
        key.CodigoAgenteVenta = selected.CodigoAgenteVenta;
        key.AgenteVenta = selected.AgenteVenta;
        key.CodigoActividad = selected.CodigoActividad;
        key.RazonSocial = selected.RazonSocial;
        key.Ruc = selected.Ruc;
        key.TipoSociedad = selected.TipoSociedad;
        key.NombreGrupo = selected.NombreGrupo;
        key.CodigoCiudad = selected.CodigoCiudad;
        key.Ciudad = selected.Ciudad;
        key.Barrio = selected.Barrio;
        key.Calle = selected.Calle;
        key.Zona = selected.Zona;
        key.Casilla = selected.Casilla;
        key.Telefono = selected.Telefono;
        key.Fax = selected.Fax;
        key.Email = selected.Email;
        key.NombresRepresentante = selected.NombresRepresentante;
        key.ApellidosRepresentante = selected.ApellidosRepresentante;
        key.CargoRepresentante = selected.CargoRepresentante;
        key.CedulaRepresentante = selected.CedulaRepresentante;
        key.RelacionRepresentante = selected.RelacionRepresentante;
        key.NombresFinanciero = selected.NombresFinanciero;
        key.ApellidosFinanciero = selected.ApellidosFinanciero;
        key.CargoFinanciero = selected.CargoFinanciero;
        key.CedulaFinanciero = selected.CedulaFinanciero;
        key.FechaDigitacion = selected.FechaDigitacion;
        key.PorcentajeComisionBroker = selected.PorcentajeComisionBroker;
        key.Digitador = selected.Digitador;
        key.AFavor = selected.AFavor;
        key.CodigoEstado = selected.CodigoEstado;
        key.Estado = selected.Estado;
        key.CodigoTecnico = selected.CodigoTecnico;
        key.EsPagoInteligente = selected.EsPagoInteligente;
        key.EmailRRHH = selected.EmailRRHH;
        key.EmailBroker = selected.EmailBroker;
        key.NumeroGrupo = selected.NumeroGrupo;
        key.PerteneceGrupo = selected.PerteneceGrupo;
        key.Telefono1 = selected.Telefono1;
        key.Telefono2 = selected.Telefono2;
        key.Fax1 = selected.Fax1;
        key.DigitadorCreacion = selected.DigitadorCreacion;
        key.FechaCreacion =  selected.FechaCreacion;
        key.HoraCreacion = selected.HoraCreacion;
        key.FechaModificacion = selected.FechaModificacion;
        key.DigitadorModificacion = selected.DigitadorModificacion;
        key.HoraModificacion = selected.HoraModificacion;
        key.FechaAnulacion = selected.FechaAnulacion;
        key.DigitadorAnulacion = selected.DigitadorAnulacion;
        key.HoraAnulacion = selected.HoraAnulacion;
        key.CodigoUnidadAgente = selected.CodigoUnidadAgente;
        key.UnidadAgente = selected.UnidadAgente;
        key.ClaveWeb = selected.ClaveWeb;
        key.CodigoAgenteContacto = selected.CodigoAgenteContacto;
        key.AgenteContacto = selected.AgenteContacto;
        key.PagoInteligenteRRHH = selected.PagoInteligenteRRHH;
        key.PagoInteligenteBroker = selected.PagoInteligenteBroker;
        key.PagoInteligenteContrato = selected.PagoInteligenteContrato;
        key.Grupo = selected.Grupo;*/
        this.CorporativoKey.next(key);
    }


}

