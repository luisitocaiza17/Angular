export class AgendaFilter {
    constructor(
        public IdCentroMedico?: string,
        public IdMedico?: string,
        public IdEspecialidad?: string,
        public IdPaciente?: string,
        public Fecha?: Date  
    ) { }
}

export class Agenda {
    constructor(
        public Causa?: string,
        public Codigo?: string,
        public Dia?: string,
        public HoraFin?: string,
        public HoraInicio?: string,
        public IdIntervalo?: string,
        public Mensaje?: string
    ) { }
}

