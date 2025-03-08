import moment from "moment";
import { Employee, Schedule } from "../interfaces/interfaces";

class WorkshiftService {

  getWorkshtifType(employee: Employee): string {
    return employee.relationships.workshifts[0].attributes.name;
  }

  getWeekWorkedHours(employee: Employee): number {
    return employee.relationships.workshifts[0].attributes.maximun_weekly_hours;
  }

  getWeekSchedule(employee: Employee): Schedule[] {
    const horario: Schedule[] = [];
  
    // Recorre los días de la semana
    employee.relationships.workshifts[0].relationships.workshiftDays.forEach((day) => {
      // Declara el objeto schedule dentro del forEach para evitar la sobreescritura
      const schedule: Schedule = {
        day: this.getDay(day.attributes.day),
        start_at: moment(day.attributes.start_at, "HH:mm:ss").format("HH:mm A"),
        finished_at: moment(day.attributes.finished_at, "HH:mm:ss").format("HH:mm A"),
        break_duration: "No tiene"
      };
  
      // Si el día tiene un tiempo de descanso, calculamos su duración
      if (day.attributes.break_time_start_at != null) {
        const inicio = moment(day.attributes.break_time_start_at);
        const final = moment(day.attributes.break_time_finished_at);
        const duration = moment.duration(final.diff(inicio));
        schedule.break_duration = duration.hours() + " horas";
      }
  
      // Agrega el objeto schedule al arreglo horario
      horario.push(schedule);
    });
  
    return horario;
  }
  

  getDay(day: string): string{
    switch (day) {
      case '1':
        return "Lunes";
      case '2':
        return "Martes";
      case '3':
        return "Miercoles";
      case '4':
        return "Jueves";
      case '5':
        return "Viernes";
      case '6':
        return "Sabado";
      case '7':
        return "Domingo";
      default:
        return "Dia no valido";
    }
  }

}

export default new WorkshiftService();