import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { correctHeight } from '../app.helpers';
import { AuthService } from '../seguridad/auth.service';
import { RegionService } from '../common/servicios/region.service';
import { CorporativoService } from '../common/servicios/corporativo.service';

import { Region } from '../common/model/region';
import { EmpresaCoorporativo, CorporativoList, CorporativoFilter } from '../common/model/corporativo';
import { Sucursal, SucursalNombre, SucursalFilter, SucursarList } from '../common/model/sucursal';
import { ConstantService } from '../utils/constant.service';
import { CorporativoComponent } from './corporativo.component';
import { Permiso } from '../seguridad/usuario';
import { SucursalService } from '../common/servicios/sucursal.service';
import { CorporativoFormComponent } from './corporativo.form.component';




@Component({
    selector: 'sucursalForm',
    providers: [SucursalService],
    templateUrl: 'sucursal.form.template.html'
})

export class SucursalFormComponent implements OnInit {

    suscription: any;
    corporativokey: CorporativoList;
    opcion: string;
    sucursal: Sucursal;
    sucursales: Sucursal [];
    sucursalnombre: SucursalNombre;
    sucursalnombres: SucursalNombre [];
    filter: SucursalFilter;
    isDesplegar: boolean;
    sucursalkey: SucursarList;

    private SucursalKey: BehaviorSubject<SucursarList> = new BehaviorSubject<SucursarList>(null);
    selectSucursal$: Observable<SucursarList> = this.SucursalKey.asObservable();

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private regionService: RegionService,
        private sucursalservice: SucursalService, private constantService: ConstantService,
        private CorporativoComponent: CorporativoComponent, private SucursalComponent: CorporativoFormComponent) {

        this.sucursal = new Sucursal();

        this.sucursalkey = new SucursarList();
        this.sucursalnombre = new SucursalNombre();

        this.suscription = this.SucursalComponent.selectSucursal$.subscribe(
            (sucursalkey) => {

                if (sucursalkey != undefined && sucursalkey.Numero != undefined) {
                    this.sucursalkey = sucursalkey;
                    this.filter.Numero = sucursalkey.Numero;
                    console.log(sucursalkey);
                  // this.buscarSucursales();
                }
            }
        );

    }


    ngOnInit(): void {
        this.opcion = "";
        this.sucursales = [];
        this.filter = new SucursalFilter();
    }

    isActive(divActivo: string) {
        if (this.opcion == divActivo)
        return true;

        return false;
    }

    activar(opcion: string) {
        this.opcion = opcion;
        this.colapsarTabSucursales();
    }

    colapsarTabSucursales(): void {
        this.isDesplegar = false;
        //var key = new SucursarList();
        //this.Sucursalkey.next(key);

    }

}