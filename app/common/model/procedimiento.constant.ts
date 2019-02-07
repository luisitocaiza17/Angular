export class Funcion {
    public static PRINCIPAL: string = "Principal";
    public static CLINICA: string = "Clínica";
    public static ANESTESISTA: string = "Anestesista";
    public static AYUDANTE: string = "Ayudante";
    public static SEGUNDO_PROCEDIMIENTO: string = "Segundo Procedimiento";
    public static TERCER_PROCEDIMIENTO: string = "Tercer Procedimiento";

    public static funciones = [
        { Nombre: Funcion.PRINCIPAL, Porcentaje: 100 },
        { Nombre: Funcion.CLINICA, Porcentaje: 80 },
        { Nombre: Funcion.ANESTESISTA, Porcentaje: 35 },
        { Nombre: Funcion.AYUDANTE, Porcentaje: 30 },
        { Nombre: Funcion.SEGUNDO_PROCEDIMIENTO, Porcentaje: 50 },
        { Nombre: Funcion.TERCER_PROCEDIMIENTO, Porcentaje: 25 }];
}