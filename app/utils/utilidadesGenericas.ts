import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/share';

@Injectable()
export class utilidadesGenericasService {

    constructor() {

    }

    public datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es',
    };

    public sectores = [
        { label: 'Norte', value: 'Norte' },
        { label: 'Centro', value: 'Centro' },
        { label: 'Sur', value: 'Sur' },
    ];

    compararDosObjetos(objetoA: Object, objetoB: Object) {

        var aProps = Object.getOwnPropertyNames(objetoA);
        var bProps = Object.getOwnPropertyNames(objetoB);

        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
            if (objetoA[propName] !== objetoB[propName]) {
                return false;
            }
        }

        return true;

    }

    getNombreMes(mes: number): string {
        var result = "";

        if (mes == 0)
            result = 'Ene';
        if (mes == 1)
            result = 'Feb';
        if (mes == 2)
            result = 'Mar';
        if (mes == 3)
            result = 'Abr';
        if (mes == 4)
            result = 'May';
        if (mes == 5)
            result = 'Jun';
        if (mes == 6)
            result = 'Jul';
        if (mes == 7)
            result = 'Ago';
        if (mes == 8)
            result = 'Sep';
        if (mes == 9)
            result = 'Oct';
        if (mes == 10)
            result = 'Nov';
        if (mes == 11)
            result = 'Doc';

        return result;
    }


    getTodayDate() {
        var today = new Date();
        today.setHours(0,0,0);
        return today;
    }

    getCurrentTimeHoursMinutesFormat(): string {
        var today = new Date();
        var hours = today.getHours().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        var minutes = today.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        var time = hours + ':' + minutes;
        return time;
    }

    getCurrentTimeAddingHours(nHours: number): string {
        var today = new Date();
        var hours = (today.getHours() + nHours).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        var minutes = today.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
        var time = hours + ':' + minutes;
        return time;
    }

    getYesterdayDate(): Date {
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth();
        var day = today.getDate() - 1;
        return new Date(year, month, day);
    }

    getDateFirstDayOfMonth() {
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth();
        var day = 1;
        return new Date(year, month, day);
    }

    getDateLastDayOfMonth() {
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth() + 1;
        var day = 1;
        return new Date(year, month, 0);
    }

    zeroPad(num, numZeros): string {
        var n = Math.abs(num);
        var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
        var zeroString = Math.pow(10, zeros).toString().substr(1);
        if (num < 0) {
            zeroString = '-' + zeroString;
        }

        return zeroString + n;
    }

    convertDatetoString(fecha: Date): string {
        var year = fecha.getFullYear();
        var month = (fecha.getMonth() + 1).toString();
        var day = (fecha.getDay() + 1).toString();

        if (month.length == 1) {
            month = "0" + month;
        }

        if (day.length == 1) {
            day = "0" + day;
        }

        return year + "/" + month + "/" + day;
    }

    convertDateToFormattedString(fecha: Date, formato: string): string {
        var year = fecha.getFullYear();
        var month = (fecha.getMonth() + 1).toString();
        var day = (fecha.getDay() + 1).toString();

        if (month.length == 1) {
            month = "0" + month;
        }

        if (day.length == 1) {
            day = "0" + day;
        }

        if(formato == "dd-MM-yy")
            return day + "-" + month + "-" + year.toString().substr(2, 3);
        else
            return year + "/" + month + "/" + day;
    }

    //Formato STRING dd/mm/yyy
    convertStringToDate(fecha: string): Date {
        var parts = fecha.split('/');
        var fechaString = parts[2].toString() + "-" + parts[1].toString() + "-" + parts[0];
        var fechaDate = new Date(fechaString);
        return fechaDate;

    }

    devolverMinutosentreHoras(horaInicio: string, horaFin: string): number {
        var horaI = (parseInt(horaInicio.split(":")[0]) * 60) + parseInt(horaInicio.split(":")[1]);
        var horaF = (parseInt(horaFin.split(":")[0]) * 60) + parseInt(horaFin.split(":")[1]);

        var result = horaF - horaI;
        return result;
    }

    GetDateTimeUTCTimeZone(fecha: Date): Date {
        var fecha = new Date(fecha);
        fecha.setHours(fecha.getHours() + 5);
        return fecha;

    }

    getNumberOfDays(fecha1: Date, Fecha2: Date): number {
        //fehca1 puede ser FECHA ACTUAL
        fecha1 = new Date(fecha1);
        Fecha2 = new Date(Fecha2);

        var timeDiff = Math.abs(Fecha2.getTime() - fecha1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays;
    }

    proximoMes(fecha: Date): Date {
        var fechaActual = new Date(fecha);
        fechaActual.setMonth(fechaActual.getMonth() + 1);
        fechaActual.setDate(1);
        fechaActual.setHours(0);
        fechaActual.setMinutes(0);
        fechaActual.setSeconds(0);
        fechaActual.setMilliseconds(0);
        return fechaActual;
    }
} 
