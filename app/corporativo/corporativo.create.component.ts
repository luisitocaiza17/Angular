import { Component, OnInit, ElementRef, ChangeDetectorRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { correctHeight } from '../app.helpers';
import { AuthService } from '../seguridad/auth.service';
import { ConstantService } from '../utils/constant.service';
import { RegionService } from '../common/servicios/region.service';
import { Region } from '../common/model/region';
import { GrupoService } from '../common/servicios/grupo.service';
import { Grupo } from '../common/model/grupo';
import { ActividadService } from '../common/servicios/actividad.service';
import { Actividad } from '../common/model/actividad';
import { SociedadService } from '../common/servicios/sociedad.service';
import { Sociedad } from '../common/model/sociedad';
import { RolService } from '../common/servicios/rol.service';
import { Rol } from '../common/model/rol';
import { Unidad } from '../common/model/unidad';
import { ContratoEntityFilter, ContratoEntityList, ContratoKey } from '../common/model/contrato';
import { Sucursal, SucursalNombre } from '../common/model/sucursal';
import { Usuario } from '../common/model/usuario';
import { CatalogoService } from '../common/servicios/catalogo.service';
import { Catalogo } from '../common/model/catalogo';

import {EmpresaCoorporativo, CorporativoEntity, EmpresaDireccion, PersonaEntity} from '../common/model/corporativo';
import { Agente } from '../common/model/agente';
import { AgenteService } from '../common/servicios/agente.service';

import { CorporativoService } from '../common/servicios/corporativo.service';
import { TransaccionService } from '../common/servicios/transaccion.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ProductoContrato } from '../common/model/autorizacion.constant';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Field } from '../common/model/field';

@Injectable()


@Component({
        providers: [CorporativoService, AgenteService],
    templateUrl: 'corporativo.create.template.html'
})

export class CorporativoCreateComponent implements OnInit {
    errors: Array<string> = [];
    dragAreaClass: string = 'dragarea';
    @Input() projectId: number;
    @Input() sectionId: number;
    @Input() fileExt: string = "JPG, GIF, PNG";
    @Input() maxFiles: number = 5;
    @Input() maxSize: number = 5; // 5MB
    @ Output() uploadStatus = new EventEmitter();


    corporativo: CorporativoEntity;
    agentes: Agente[];
    regiones: Region[];
    grupos: Grupo[];
    usuari: Usuario;
    users: Usuario[];
    actividades: Actividad[];
    sociedades: Sociedad[];
    contrato: ContratoEntityList[];
    ciudades: Catalogo[];
    sectoresCompletos: Catalogo[];
    sectoresFiltrados: Catalogo[];

    empresaDireccion: EmpresaDireccion;
    sucursalNombre: SucursalNombre;
    sucursalesNombre: SucursalNombre[];
    Conta= 2000;
    values= ' caracteres restantes';
    Mensaje= this.Conta + this.values;
    MensajeVision= this.Conta + this.values;
    unidades: Unidad[];

    selectedFile: File = null;
    roles: Rol[];
    filter: ContratoEntityFilter;
    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private constantService: ConstantService,
        public corporativoService: CorporativoService, public transaccionService: TransaccionService,  private regionService: RegionService,
        private grupoService: GrupoService, private rolService: RolService, private agenteService: AgenteService,
         private actividadService: ActividadService, private sociedadService: SociedadService,
        private catalogoService: CatalogoService, private fileService: CorporativoService,
        private http: HttpClient) {

            this.corporativo = new CorporativoEntity();
            this.corporativo.Empresa = new EmpresaCoorporativo();
            this.corporativo.Sucursal = new Sucursal();
            this.sucursalNombre = new SucursalNombre();
            this.filter = new ContratoEntityFilter();
            this.usuari = new Usuario();
            this.usuari.rol = new Rol;
            this.corporativo.Empresa.PorcentajeComisionBroker = 5;
            this.empresaDireccion = new EmpresaDireccion();

            this.sectoresCompletos = [];
            this.sectoresFiltrados = [];
        
            }
    
    saveFiles(files) {
        this.errors = []; // Clear error
        // Validate file size and allowed extensions
        if (files.length > 0 && (!this.isValidFiles(files))) {
            this.uploadStatus.emit(false);
            return;
        }
        if (files.length > 0) {
              const formData: FormData = new FormData();
              for (let j = 0; j < files.length; j++) {
                  formData.append("file[]", files[j], files[j].name);
              }
              const parameters = {
                  projectId: this.projectId,
                  sectionId: this.sectionId
              }
              this.fileService.upload(formData, parameters)
                  .subscribe(
                  success => {
                    this.uploadStatus.emit(true);
                    console.log(success)
                  },
                  error => {
                      this.uploadStatus.emit(true);
                      this.errors.push(error.ExceptionMessage);
                  })
          }
      }


 private isValidFiles(files) {
       // Check Number of files
        if (files.length > this.maxFiles) {
            this.errors.push("Error: At a time you can upload only " + this.maxFiles + " files");
            return;
        }
        this.isValidFileExtension(files);
        return this.errors.length === 0;
    }

    private isValidFileExtension(files) {
        // Make array of file extensions
          const extensions = (this.fileExt.split(','))
                          .map(function (x) { return x.toLocaleUpperCase().trim() });

          for (let i = 0; i < files.length; i++) {
              // Get file extension
              const ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
              // Check the extension exists
              const exists = extensions.push(ext);
              if (!exists) {
                  this.errors.push("Error (Extension): " + files[i].name);
              }
              // Check file size
              this.isValidFileSize(files[i]);
          }
    }


    private isValidFileSize(file) {
          const fileSizeinMB = file.size / (1024 * 1000);
          const size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
          if (size > this.maxSize)
          this.errors.push('Error (File Size): ' + file.name + ": exceed file size limit of " + this.maxSize + 'MB ( ' + size + "MB )");
    }

   onFileChange(event) {
    const files = event.target.files;
     //const  files = this.selectedFile;
     //this.selectedFile = event.target.files[0];
     this.saveFiles(files);
     this.corporativo.Empresa.EmpresaLogo = files[0].name;
     console.log(this.corporativo);
     console.log(files);
    }

    @HostListener('dragover', ['$event']) onDragOver(event) {
        this.dragAreaClass = "droparea";
        event.preventDefault();
    }

    @HostListener('dragenter', ['$event']) onDragEnter(event) {
        this.dragAreaClass = "droparea";
        event.preventDefault();
    }

    @HostListener('dragend', ['$event']) onDragEnd(event) {
        this.dragAreaClass = "dragarea";
        event.preventDefault();
    }

    @HostListener('dragleave', ['$event']) onDragLeave(event) {
        this.dragAreaClass = "dragarea";
        event.preventDefault();
    }
    @HostListener('drop', ['$event']) onDrop(event) {
        this.dragAreaClass = "dragarea";
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        this.saveFiles(files);
    }

  /*  onUpload(files, parameters) {
        const headers = new Headers();
        const options = new RequestOptions({ headers: headers });
        options.params = parameters;
        return  this.http.post(this._baseURL + 'upload', files, options)
                 .map(response => response.json())
                 .catch(error => Observable.throw(error));

    }


    onFileSelected() {
        return this.http.get(this._baseURL + "getimages")
                   .map(response => response.json())
                   .catch(error => Observable.throw(error));
    } */


    ngOnInit(): void {
        this.loadRegiones();
        this.loadAgentes();
        this.consultarRoles();
        this.loadGrupos();
        this.corporativo.Sucursales = [];
        this.loadActividades();
        this.consultarSociedad();
        this.consultarUnidades();
        this.consultarCiudades();
        this.consultarSectores();
        this.regiones = [];
        this.users = [];
        this.grupos = [];
        this.sucursalesNombre = [];
        //this.actividades = [];
        //this.sociedades = [];
        //this.ciudades = [];
    }


    loadRegiones(): void {
        this.regionService.getAll()
            .subscribe(regiones => {
               // console.log(regiones)
                this.regiones = regiones;
            },
            error => this.authService.showErrorPopup(error));
        }
    loadGrupos(): void {
        this.grupoService.GetGrupos()
            .subscribe(grupos => {
                //    console.log(grupos)
                    this.grupos = grupos;
                },
            error => this.authService.showErrorPopup(error));
            }
    guardar(): void {
        this.corporativoService.crearCorporativo(this.corporativo).subscribe(
            result => {
                      console.log(result);
                      this.authService.showSuccessPopup("Se creo correctamente el corporativo.");
                      this.router.navigate(['/corporativo']);
            },
            error => console.log(error)
            //this.authService.showErrorPopup("La empresa ya existe.");
        );
    }

    consultarRoles(): void {
        this.corporativoService.getRoles().subscribe(
            result => {
                this.roles = result;
                //console.log(result);
            },
            error => console.log(error)
        );
    }
    consultarUnidades(): void {
        this.corporativoService.getUnidadesResponsables().subscribe(
            result => {
                this.unidades = result;
                //console.log(result);
            },
            error => console.log(error)
        );
    }

    consultarSociedad(): void {
        this.corporativoService.getCatalogoGen('TIPSOCIE').subscribe(
            result => {
                this.sociedades = result;
               // console.log(result);
            },
            error => console.log(error)
        );
    }

    loadActividades(): void {
        this.corporativoService.getCatalogoGen("TIPACTIV")
            .subscribe(actividades => {
                  //  console.log(actividades)
                    this.actividades = actividades;
                },
            error => this.authService.showErrorPopup(error));
    }

    loadAgentes(): void {
        this.agenteService.getAgentes("AS")
            .subscribe(agentes => {
                console.log(agentes)
                this.agentes = agentes;
            },
            error => this.authService.showErrorPopup(error));
    }


    InsertarUsuarioTabla() {
        console.log(this.usuari);
        this.roles.forEach(element => {
           // console.log(element);
            if (this.usuari.rol.Id == element.Id) {
                this.usuari.rol.Nombre = element.Nombre;
            }
        });
        this.users.push(this.usuari);
        this.corporativo.Usuarios = this.users;
       // console.log(this.corporativo);
        this.usuari = new Usuario();
        this.usuari.rol = new Rol;
    }

    InsertarSucursalTabla() {
        const suc = new Sucursal();
        suc.Nombre = this.sucursalNombre.descripcion + " MAX:" + this.sucursalNombre.max + " Nivel:" + this.sucursalNombre.nivel;
        suc.CodigoProducto = this.sucursalNombre.producto;
        this.sucursalesNombre.push(this.sucursalNombre);
        this.corporativo.Sucursales.push(suc);
      //  console.log(this.corporativo);
        this.sucursalNombre = new SucursalNombre();
    }

    BuscarUsuario(): void {
        this.corporativoService.getUsuarioByCedula(this.filter)
            .subscribe(contratos => {
                this.loadDataUsuario(contratos);
            },
            error => this.authService.showErrorPopup(error));
    }
    onKey(event: any) { // without type info
        const x = this.Conta - jQuery("#EmpresaMision").val().length;
        this.Mensaje = x + this.values;
      }
      onKeyVision(event: any) { // without type info
        const x = this.Conta - jQuery("#EmpresaVision").val().length;
        this.MensajeVision = x + this.values;
      }


    loadDataUsuario(contratos: ContratoEntityList[]): void {
       // console.log(contratos);
    }


    onKeyUsuario(event: any) { // without type info
        const x = jQuery("#CedulaUsuario").val().length;
        if (x >= 10) {
           this.filtrarUsuario();
        }
      }

      onKeyRepresentante(event:any) {
        const x = this.corporativo.Empresa.CedulaRepresentante.length;
        if(x>=10){
            this.consultarUsuarioRegistroCivil(this.corporativo.Empresa.CedulaRepresentante);
        }
}

    consultarUsuarioRegistroCivil(number:string): void{
        /*this.corporativoService.ObtenerPersonaPorNumeroIdentificacion(number)
            .subscribe(result => {
                let x: PersonaEntity = result;
                if (x !== undefined) {
                    this.corporativo.Empresa.NombresRepresentante = x.Primer_Nombre + ' ' + x.Segundo_Nombre;
                    this.corporativo.Empresa.ApellidosRepresentante = x.Primer_Apellido + ' ' + x.Segundo_Apellido;
                    this.corporativo.Empresa.RepresentanteMail = x.Email_Personal;
                    this.corporativo.Empresa.RepresentanteTelefono = x.Telefono_Domicilio;
                    this.corporativo.Empresa.RepresentanteCelular = x.Telefono_Trabajo;
                }
            })*/
    }

    filtrarUsuario(): void {
       const filterTrans = new ContratoEntityFilter();
       filterTrans.NumeroCedula = this.usuari.Cedula;
        this.transaccionService.getByFiltersTransaccionPaginated(filterTrans)
            .subscribe(contratos => {
                this.contrato = contratos;
                let x = 0;
                this.contrato.forEach(element => {
                    if (x==0) {
                    this.usuari.NombreApellido = element.NombresApellidos;
                    this.usuari.Email = element.EmailTrabajo;
                    this.usuari.Telefono = element.TelefonosTrabajo;
                }
                x++;
                });
            },
            error => this.authService.showErrorPopup(error));
    }

    changeDireccion() {
        let dir="";
        if (this.empresaDireccion.calle1 != "undefined") {
            if (dir != "undefined") {
                dir = dir + this.empresaDireccion.calle1;
            } else {
                dir = this.empresaDireccion.calle1;
            }
        }
        if (this.empresaDireccion.calle2 != "undefined") {
            if (dir != "undefined") {
                dir = dir + " " + this.empresaDireccion.calle2;
            } else {
                dir = this.empresaDireccion.calle2;
            }
        }
        if(this.empresaDireccion.referencia != "undefined"){
            if (dir != "undefined") {
                dir = dir + " " + this.empresaDireccion.referencia;
            } else {
                dir = this.empresaDireccion.referencia;
            }
        }
        this.corporativo.Empresa.Calle = dir;
    }

    consultarCiudades(): void {
        if (this.ciudades == undefined || this.ciudades.length == 0) {
            this.catalogoService.getCiudadesForOdas().subscribe(
                result => {
                    this.ciudades = result;
                },
                error => this.authService.showErrorPopup(error));
        }
    }

    onChangeCiudad(codCiudad: string): void {
        this.corporativo.Empresa.Zona = undefined;
        if (codCiudad != undefined && codCiudad != '' && this.sectoresCompletos != undefined) {
            var ciudad = this.ciudades.find(c => c.CodigoProgress == codCiudad);
            if (ciudad != undefined)
                this.sectoresFiltrados = this.sectoresCompletos.filter(s => s.CodigoProgress == ciudad.Codigo);
        }
        else
            this.sectoresFiltrados = [];
    }
    consultarSectores(): void {
        if (this.sectoresCompletos == undefined || this.sectoresCompletos.length == 0) {
            this.catalogoService.getSectoresForOdas().subscribe(
                result => {
                    this.sectoresCompletos = result;
                },
                error => this.authService.showErrorPopup(error));
        }
    }
}
