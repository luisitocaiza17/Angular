import { Component, OnInit, Compiler } from '@angular/core';
import { Router } from '@angular/router';
import { correctLoginHeight } from '../../app.helpers';
import { ConstantService } from '../../utils/constant.service';
import { AuthService } from '../../seguridad/auth.service';
import { Usuario } from '../../seguridad/usuario';

import { CatalogoAplicacionPlataforma } from '../../common/servicios/catalogoAplicacionPlataforma.service';
import { RetencionesVime } from '../../common/servicios/retencionesVime.service';
import { AdministracionSistemaService } from '../../common/servicios/administracionSistema.service';

@Component({
    providers: [CatalogoAplicacionPlataforma, RetencionesVime],
    selector: 'login',
    templateUrl: 'login.template.html'
})
export class loginComponent implements OnInit {

    usuario: Usuario;
    loading = false;
    error = '';
    access: boolean;

    constructor(private router: Router, private authService: AuthService, private constantService: ConstantService, private catalogoAplicacionPlataforma: CatalogoAplicacionPlataforma, private retencionesVime: RetencionesVime,
        private adminSystemService: AdministracionSistemaService, private compiler: Compiler
    ) { }

    ngOnInit() {
        this.usuario = new Usuario();
    }

    ngAfterViewInit() {
        setTimeout(function () {
            correctLoginHeight();
        }, 100);
    }

    login() {
        this.compiler.clearCache();

        this.loading = true;

        //PARA IP EN MAQUINAS ESPECIFICAS
        localStorage.setItem('USER_CARTERA_BOOL', "false");
        this.adminSystemService.GetIPClient().subscribe(ip => {
            this.constantService.IP_CLIENT.forEach(element => {
                if (element == ip.toString()) {
                    localStorage.setItem('USER_CARTERA_BOOL', "true");
                }
            });

            this.authService.login(this.usuario).subscribe(result => {
                if (result === true) {
                    this.setAplicacionPlataforma();
                    this.setNotificaciones(this.usuario.NombreUsuario);
                    this.router.navigate(['/mainView']);
                }
            }, error => {
                if (error.status == '504') {
                    this.error = "No existe conexión. Tiempo de espera agotado.";
                }
                else if (error.json().error == 'invalid_grant' || error.json().error == 'internal_error')
                    this.error = error.json().error_description;
                else
                    this.error = error;
                this.loading = false;
            });

        });
    }

    setAplicacionPlataforma() {
        this.catalogoAplicacionPlataforma.getId(this.constantService.CODIGO_APLICACION.toString()).subscribe(result => {
            if (result.Datos == null) {
                localStorage.setItem('codigo_aplicacion', '3');
            } else {
                localStorage.setItem('codigo_aplicacion', result.Datos.IdItem.toString());
            }

        });

        this.catalogoAplicacionPlataforma.getId(this.constantService.CODIGO_PLATAFORMA.toString()).subscribe(result => {
            if (result.Datos == null) {
                localStorage.setItem('codigo_plataforma', '7');
            } else {
                localStorage.setItem('codigo_plataforma', result.Datos.IdItem.toString());
            }

        });
    }

    setNotificaciones(usuario: string) {
        this.retencionesVime.getDescuentosPerdientesAprobacionTotal(usuario)
            .subscribe(result => {
                localStorage.setItem('numero_notificaciones', result.toString());
                this.authService.numeroNotificaciones = result;
            });
    }
}