import { Employee, AccessControl, AccessControlEmployee, Workshift } from "../interfaces/interfaces";
import moment from "moment";
import { ExtraHoursService } from "./ExtraHoursService";
import { LunchTimeService } from "./LunchTimeService";


class AccessControlService {
  //injecciones de servicios
  private extraHoursService: ExtraHoursService;
  
    constructor() {
      this.extraHoursService = new ExtraHoursService();
    }

/**
   * Calcula las horas trabajadas para un día específico.
   * @param accessControl - Objeto que contiene los registros de entrada y salida
   * @param workshift - Objeto que contiene la información del turno de trabajo
   * @returns Número de horas trabajadas redondeado
   * 
   * Proceso:
   * 1. Calcula la duración entre check-in y check-out
   * 2. Deduce el tiempo de almuerzo según el caso
   * 3. Retorna las horas según el tipo de horario (fijo, flexible, medio tiempo)
   */
  getWorkedHoursForDay(accessControl: AccessControl, workshift: Workshift): number {
    const checkIn = moment(accessControl.attributes.check_in);
    const checkOut = moment(accessControl.attributes.check_out);
    const duration = moment.duration(checkOut.diff(checkIn)).asHours();
    const lunchDeduction = LunchTimeService.calculateLunchDeduction(checkOut);

    const scheduleType = workshift.attributes.schedule_type;

    switch (scheduleType) {
      case "fixed":
      case "flexible":
        return Math.round(duration - lunchDeduction);
      case "fixed_halftime":
        return Math.round(duration - lunchDeduction);
      default:
        return 0;
    }
  }

  /**
   * Calcula el total de horas trabajadas para un empleado.
   * @param employee - Objeto con la información del empleado y sus registros
   * @returns Número total de horas trabajadas redondeado
   * 
   * Proceso:
   * 1. Recorre todos los controles de acceso del empleado
   * 2. Suma las horas trabajadas de cada día
   * 3. Redondea el total de horas
   */
  getAllWorkedHours(employee: Employee): number {
    return Math.round(
      employee.relationships.accessControls.reduce((total, control) =>
        total + (this.getWorkedHoursForDay(control, employee.relationships.workshifts[0]) || 0),
        0)
    );
  }

  /**
   * Obtiene todos los registros de control de acceso formateados de un empleado.
   * @param employee - Objeto con la información del empleado y sus registros
   * @returns Array de objetos con la información detallada de cada registro
   * 
   * Proceso:
   * 1. Mapea cada control de acceso
   * 2. Formatea las fechas y horas
   * 3. Calcula las horas extras
   * 4. Retorna array con día, hora inicio, hora fin, horas extras y horas trabajadas
   */
  getAllAccessControl(employee: Employee): AccessControlEmployee[] {
    return employee.relationships.accessControls.map(accessControl => {
      const checkOut = moment(accessControl.attributes.check_out);

      return {
        day: this.getDayName(checkOut.format('d')),
        start: moment(accessControl.attributes.check_in).format('MMMM Do YYYY, h:mm:ss a'),
        finish: checkOut.format('MMMM Do YYYY, h:mm:ss a'),
        hour_extra: this.calculateHourExtras(employee, accessControl),
        hour_worked: this.getWorkedHoursForDay(accessControl, employee.relationships.workshifts[0])!
      };
    });
  }

  /**
   * Obtiene el nombre del día en español basado en su número.
   * @param day - String con el número del día (0-6)
   * @returns String con el nombre del día en español
   * 
   * Proceso:
   * 1. Mantiene un array con los nombres de los días
   * 2. Retorna el nombre correspondiente al índice
   */
  private getDayName(day: string): string {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[parseInt(day)];
  }

  /**
   * Calcula las horas extras para un empleado en un día específico.
   * @param employee - Objeto con la información del empleado
   * @param accessControl - Objeto con los registros de entrada y salida
   * @returns Array con los tipos de horas extras calculadas
   * 
   * Proceso:
   * 1. Verifica si existen días de turno configurados
   * 2. Obtiene la hora de salida programada
   * 3. Calcula los diferentes tipos de horas extras según horario y día
   */
  private calculateHourExtras(employee: Employee, accessControl: AccessControl) {
    const workshiftDay = employee.relationships.workshifts[0].relationships.workshiftDays[0];
    const checkOut = moment(accessControl.attributes.check_out);
    const checkIn = moment(accessControl.attributes.check_in);

    return this.extraHoursService.calculateExtraHourTypes(
      checkOut,
      employee.relationships.workshifts.length === 0
      ?moment(checkIn).add(8, 'hours')
      :moment(`${checkOut.format("YYYY-MM-DD")} ${workshiftDay.attributes.finished_at}`),
      checkOut.day() === 0,
      employee.attributes.salary,
      employee.relationships.workshifts[0].attributes.maximun_weekly_hours
    );
  }
}

export default new AccessControlService();