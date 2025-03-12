import moment from "moment";
import { Employee, Schedule, WorkshiftDayAttributes } from "../interfaces/interfaces";

class WorkshiftService {

  /**
   * Mapeo de números de día a nombres en español
   * @private
   * @readonly
   */
  private readonly dayMap: Record<string, string> = {
    '0': 'Domingo',
    '1': 'Lunes',
    '2': 'Martes',
    '3': 'Miercoles',
    '4': 'Jueves',
    '5': 'Viernes',
    '6': 'Sabado'
  };

  /**
  * Obtiene el tipo de turno del empleado
  * @param employee - Objeto empleado que contiene la información de sus turnos
 * @returns Nombre del turno del empleado
 */
  getWorkshtifType(employee: Employee): string {
    return employee.relationships.workshifts[0].attributes.name;
  }

  /**
  * Calcula las horas semanales trabajadas por el empleado
  * @param employee - Objeto empleado que contiene la información de sus turnos
  * @returns Número total de horas semanales
  */
  getWeekWorkedHours(employee: Employee): number {
    return employee.relationships.workshifts[0].attributes.maximun_weekly_hours;
  }

  /**
  * Genera el horario semanal del empleado
  * @param employee - Objeto empleado que contiene la información de sus turnos
  * @returns Array de objetos Schedule con la información de cada día
  */
  getWeekSchedule(employee: Employee): Schedule[] {
    return employee.relationships.workshifts[0].relationships.workshiftDays.map((day) => {
      const schedule: Schedule = {
        day: this.getDay(day.attributes.day),
        start_at: this.formatTime(day.attributes.start_at),
        finished_at: this.formatTime(day.attributes.finished_at),
        break_duration: this.calculateBreakDuration(day.attributes)
      };
      return schedule;
    });
  }

  /**
  * Formatea una hora dada al formato HH:mm AM/PM
  * @param time - Hora en formato HH:mm:ss
  * @returns Hora formateada en formato HH:mm AM/PM
  * @private
  */
  private formatTime(time: string): string {
    return moment(time, "HH:mm:ss").format("HH:mm A");
  }

  /**
  * Calcula la duración del descanso
  * @param attributes - Objeto con los atributos de inicio y fin del descanso
  * @returns Duración del descanso en horas o "--" si no hay descanso
  * @private
 */
  private calculateBreakDuration(attributes: WorkshiftDayAttributes): string {
    if (!attributes.break_time_start_at || !attributes.break_time_finished_at) {
      return "--";
    }

    const inicio = moment(attributes.break_time_start_at, "HH:mm:ss");
    const final = moment(attributes.break_time_finished_at, "HH:mm:ss");
    return moment.duration(final.diff(inicio)).hours().toString();
  }

  /**
  * Convierte el número de día a su nombre en español
  * @param day - Número de día (0-6)
  * @returns Nombre del día en español o "Dia no valido" si el número no es válido
  * @private
  */
  private getDay(day: string): string {
    return this.dayMap[day] || "Dia no valido";
  }
}

export default new WorkshiftService();
