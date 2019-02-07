import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { correctHeight } from '../app.helpers';
import { AuthService } from '../seguridad/auth.service';
import { PrestadorService } from '../common/servicios/prestador.service';

import { PrestadorFilter, Prestador, PrestadorKey } from '../common/model/prestador';
import { Agenda, AgendaFilter } from '../common/model/agenda';
import { Cita, CitaFilter } from '../common/model/cita';
import { UsuarioVeris, UsuarioVerisFilter } from '../common/model/usuarioVeris';
import { PacienteVeris, PacienteVerisFilter } from '../common/model/pacienteVeris';
import { BeneficiarioPaciente } from '../common/model/beneficiario';

import { AgendarCitaListComponent } from './agendarCita.list.component';


import { ConstantService } from '../utils/constant.service';
import { GoogleAnalyticsEventsService } from '../common/servicios/googleAnalyticsEvents.service';

@Component({
    selector: 'agendarCitaForm',
    providers: [GoogleAnalyticsEventsService],
    templateUrl: 'agendarCita.form.template.html'
})

export class AgendarCitaFormComponent implements OnInit {

    suscription: any;
    suscriptionBeneficiario: any;
    prestadorKey: PrestadorKey;
    beneficiarioKey: BeneficiarioPaciente;
    opcion: string;
    prestadorFilter: PrestadorFilter;
    agendaFilter: AgendaFilter;
    agendas: Agenda[];
    citaFilter: CitaFilter;
    cita: Cita;
    usuarioVeris: UsuarioVeris;
    usuarioVerisFilter: UsuarioVerisFilter;
    pacienteVeris: PacienteVeris;
    pacienteVerisFilter: PacienteVerisFilter;


    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService,
        private agendarCitaListComponent: AgendarCitaListComponent,
        private prestadorService: PrestadorService,
        private constantService: ConstantService,
        public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {

        this.initializeAnalytics();

        this.prestadorKey = new PrestadorKey();
        this.beneficiarioKey = new BeneficiarioPaciente();
        this.prestadorFilter = new PrestadorFilter();
        this.agendaFilter = new AgendaFilter();
        this.agendas = [];
        this.agendaFilter.Fecha = new Date();
        this.citaFilter = new CitaFilter();
        this.cita = new Cita();
        this.usuarioVeris = new UsuarioVeris();
        this.usuarioVerisFilter = new UsuarioVerisFilter();
        this.pacienteVeris = new PacienteVeris();
        this.pacienteVerisFilter = new PacienteVerisFilter();


        this.suscription = this.agendarCitaListComponent.selectPrestador$.subscribe(
            (prestadorKey) => {
                if (prestadorKey != undefined && prestadorKey.CentralMedical != undefined) {
                    this.prestadorKey = prestadorKey;
                    this.suscriptionBeneficiario = this.agendarCitaListComponent.selectBeneficiario$.subscribe(
                        (beneficiarioKey) => {
                            if (beneficiarioKey != undefined && beneficiarioKey.NumeroIdentificacion != undefined) {
                                this.beneficiarioKey = beneficiarioKey;
                                if (this.usuarioVeris.IdPaciente == undefined) {
                                    this.CrearPaciente();
                                }

                            }
                        }
                    );
                }
            }
        );

    }

    ngOnInit(): void {
        this.opcion = "";

    }

    salir():void{
        this.agendarCitaListComponent.salir();
    }

    isActive(divActivo: string) {
        if (this.opcion == divActivo)
            return true;
        return false;
    }

    activar(opcion: string) {
        this.opcion = opcion;
    }

    prepararAgenda() {
        this.citaFilter = new CitaFilter();
        this.agendaFilter.IdMedico = this.prestadorKey.IdMedico.toString();
        this.agendaFilter.IdEspecialidad = this.prestadorKey.CodigoEspecialidad;
        //this.agendaFilter.IdPaciente = this.getCedulaConFormato();
        this.agendaFilter.IdCentroMedico = this.prestadorKey.CodigoCentroMedico;
        this.prestadorService.getAgenda(this.agendaFilter).subscribe(
            result => {
                this.agendas = result;
                this.googleAnalyticsEventsService.emitPageView("/Doctor/DetailProviderMedicalCenter?Source=Search");
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    confirmarAgenda() {
        this.citaFilter.IdPaciente = this.agendaFilter.IdPaciente;
        this.prestadorService.setCita(this.citaFilter).subscribe(
            result => {
                this.cita = result;
                this.googleAnalyticsEventsService.emitPageView("/Doctor/Appointment");
                jQuery("#horarioShowModal").modal("hide");
                if (this.cita.Codigo == "20") {
                    this.getMensaje(); //this.authService.showSuccessPopup(this.cita.Mensaje);
                    this.googleAnalyticsEventsService.emitPageView("/Doctor/AppointmentResult?Result=true");
                } else {
                    this.authService.showErrorPopup(this.cita.Mensaje + ". " + this.cita.Causa);
                }

            },
            error => this.authService.showErrorPopup(error)
        );


    }


    getMensaje(): void {
        this.authService.showSuccessPopup(
            "<h4>¡Tu cita en Veris ha sido agendada con éxito!</h4>" +
            "<div class='panel panel-success'>" +
            "   <h4>Información de tu cita</h4>" +
            "   <center>" +
            "   <table width='90%'>" +
            "       <tr>" +
            "           <td align='left' ><h4>Medico: </h4></td>" +
            "           <td align='left' ><h5>" + this.prestadorKey.PrimerApellido + " " + this.prestadorKey.SegundoApellido + " " + this.prestadorKey.PrimerNombre + " " + this.prestadorKey.SegundoNombre + "</h5></td>" +
            "       </tr>" +
            "       <tr>" +
            "           <td align='left' ><h4>Especialidad: </h4></td>" +
            "           <td align='left' ><h5>" + this.prestadorKey.Especialidad + "</h5></td>" +
            "       </tr>" +
            "       <tr>" +
            "           <td align='left' ><h4>Paciente: </h4></td>" +
            "           <td align='left' ><h5>" + this.beneficiarioKey.PrimerApellido + " " + this.beneficiarioKey.SegundoApellido + " " + this.beneficiarioKey.PrimerNombre + "</h5></td>" +
            "       </tr>" +
            "       <tr>" +
            "           <td align='left' ><h4>Fecha: </h4></td>" +
            "           <td align='left' ><h5>" + this.agendas[0].Dia + "</h5></td>" +
            "       </tr>" +
            "       <tr>" +
            "           <td align='left' ><h4>Hora: </h4></td>" +
            "           <td align='left' ><h5>" + this.getHora() + "</h5></td>" +
            "       </tr>" +
            "       <tr>" +
            "           <td align='left' ><h4>Centro: </h4></td>" +
            "           <td align='left' ><h5>" + this.prestadorKey.CentralMedical + "</h5></td>" +
            "       </tr>" +
            "   </table>" +
            "   </center>" +
            " </div>" +
            "<h5>Recibirás una confirmación de tu cita en tu correo electronico.</h5>");
    }

    CrearPaciente(): void {
        this.usuarioVerisFilter.Documento = this.prestadorKey.NumeroCedula;

        this.prestadorService.getUsuario(this.usuarioVerisFilter).subscribe(
            result => {
                this.usuarioVeris = result;
                if (this.usuarioVeris.Codigo != 0 || this.usuarioVeris.IdPaciente == null) {
                    this.setPaciente();
                    
                } else {
                    this.agendaFilter.IdPaciente = this.usuarioVeris.IdPaciente;
                    
                }

            },
            error => this.authService.showErrorPopup(error)
        );
        
    }

    setPaciente(): void {
        this.pacienteVerisFilter.FechaNacimiento = this.beneficiarioKey.FechaNacimiento;
        this.pacienteVerisFilter.Mail = this.beneficiarioKey.Mail;
        this.pacienteVerisFilter.NumeroIdentificacion = this.beneficiarioKey.NumeroIdentificacion;
        this.pacienteVerisFilter.PrimerApellido = this.beneficiarioKey.PrimerApellido;
        this.pacienteVerisFilter.PrimerNombre = this.beneficiarioKey.PrimerNombre;
        this.pacienteVerisFilter.SegundoApellido = this.beneficiarioKey.SegundoApellido;
        this.pacienteVerisFilter.TelefonoMovil = this.beneficiarioKey.TelefonoMovil;
        this.pacienteVerisFilter.TipoIdentificacion = this.beneficiarioKey.TipoIdentificacion;
        this.pacienteVerisFilter.Genero = this.beneficiarioKey.Genero;

        console.log(this.pacienteVerisFilter);
        this.prestadorService.setPaciente(this.pacienteVerisFilter).subscribe(
            result => {
                this.pacienteVeris = result;
                this.agendaFilter.IdPaciente = this.pacienteVeris.IdPaciente;

            },
            error => this.authService.showErrorPopup(error)
        );
    }


    getCedulaConFormato(): string {
        return this.prestadorKey.NumeroCedula.slice(0, 9) + "-" + this.prestadorKey.NumeroCedula.slice(-1);
    }

    getHora(): string {
        for (let agenda of this.agendas) {
            if (agenda.IdIntervalo == this.citaFilter.IdIntervalo) {
                return agenda.HoraInicio + " - " + agenda.HoraFin;
            }
        }
        return "";
    }

    private initializeAnalytics() {
        (function (i, s, o, g, r, a?, m?) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * <any>new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        ga('create', this.constantService.ID_GOOGLE_ANALITICS, 'auto');


    }

}
