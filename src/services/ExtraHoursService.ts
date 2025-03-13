import moment from "moment";
import { HourExtra } from "../interfaces/interfaces";
import { SalaryCalculatorService } from "./SalaryCalculatorService";
import { LunchTimeService } from "./LunchTimeService";


export class ExtraHoursService {
  private salaryCalculator: SalaryCalculatorService;

  constructor() {
    this.salaryCalculator = new SalaryCalculatorService();
  }
/**
   * Calcula las horas extras trabajadas antes y después del turno nocturno
   * @param checkOutTime - Hora de salida del empleado en formato string
   * @param scheduledEndTime - Hora programada de fin de turno en formato string
   * @returns Objeto con las horas extras diurnas (antes) y nocturnas (después)
   * 
   * proceso:
   * 1. Convierte las horas a objetos moment
   * 2. Define el inicio del turno nocturno (21:00)
   * 3. Calcula horas extras regulares y nocturnas según:
   *    - Si salió después de lo programado pero antes del turno nocturno
   *    - Si salió durante el turno nocturno
   * 4. Redondea las horas y retorna el resultado
   */
  calculateExtraHours(checkOutTime: string, scheduledEndTime: string)
  : { horasExtrasAntes: number; horasExtrasDespues: number } {
    const checkOut = moment(checkOutTime);
    const scheduledEnd = moment(scheduledEndTime);
    const nightShiftStart = moment(`${checkOut.format('YYYY-MM-DD')} 21:00:00`);
    const lunchDeduction = LunchTimeService.calculateLunchDeduction(checkOut);
    let regularExtra = 0;
    let nightExtra = 0;

    if (checkOut.isAfter(scheduledEnd)) {
      if (checkOut.isSameOrBefore(nightShiftStart)) {
        regularExtra = checkOut.diff(scheduledEnd, 'hours', true);
      } else {
        if (scheduledEnd.isBefore(nightShiftStart)) {
          regularExtra = nightShiftStart.diff(scheduledEnd, 'hours', true);
          nightExtra = checkOut.diff(nightShiftStart, 'hours', true);
        } else {
          nightExtra = checkOut.diff(scheduledEnd, 'hours', true);
        }
      }
    }
    return {
      horasExtrasAntes: Math.round(regularExtra - lunchDeduction),
      horasExtrasDespues: Math.round(nightExtra),
    };
  }

/**
   * Calcula los diferentes tipos de horas extras y recargos juncoto a sus valores
   * @param checkOut - Hora de salida en formato moment
   * @param finishedAt - Hora programada de fin en formato moment 
   * @param isSundayOrHoliday - Indica si es domingo o festivo
   * @param salary - Salario base del empleado
   * @param maxWeeklyHours - Máximo de horas semanales
   * @returns Array de objetos HourExtra con los diferentes tipos de horas extras calculadas
   * 
   * proceso:
   * 1. Obtiene las horas extras antes/después del turno nocturno
   * 2. Calcula según el tipo:
   *    - HED: Hora extra diurna (25%)
   *    - HEN: Hora extra nocturna (75%) 
   *    - HEDD: Hora extra dominical diurna (100%)
   *    - HEDN: Hora extra dominical nocturna (150%)
   *    - RC: Recargo nocturno (35%)
   *    - RD: Recargo dominical (75%)
   *    - RND: Recargo nocturno dominical (110%)
   */
  calculateExtraHourTypes(checkOut: moment.Moment,finishedAt: moment.Moment,isSundayOrHoliday: boolean,salary: number,maxWeeklyHours: number
  ): HourExtra[] {
    const extraHours: HourExtra[] = [];
    
    const { horasExtrasAntes, horasExtrasDespues } = this.calculateExtraHours(
      checkOut.format(),
      finishedAt.format()
    );

    // Extra diurna (HED)
    if (horasExtrasAntes > 0 && !isSundayOrHoliday) {
      this.addExtraHour(
        extraHours,
        horasExtrasAntes,
        "HED",
        this.salaryCalculator.getLaboralHourSalary(salary, maxWeeklyHours) * 1.25 // 25% extra
      );
    }

    // Extra nocturna (HEN)
    if (horasExtrasDespues > 0 && !isSundayOrHoliday) {
      this.addExtraHour(
        extraHours,
        horasExtrasDespues,
        "HEN",
        this.salaryCalculator.getLaboralHourSalary(salary, maxWeeklyHours) * 1.75 // 75% extra
      );
    }

    // Dominical/festio diruno (HEDD)
    if (horasExtrasAntes > 0 && isSundayOrHoliday) {
      this.addExtraHour(
        extraHours,
        horasExtrasAntes,
        "HEDD",
        this.salaryCalculator.getLaboralHourSalary(salary, maxWeeklyHours) * 2 // 100% extra
      );
    }

    // Dominical/festio nocturno (HEDN)
    if (horasExtrasDespues > 0 && isSundayOrHoliday) {
      this.addExtraHour(
        extraHours,
        horasExtrasDespues,
        "HEDN",
        this.salaryCalculator.getLaboralHourSalary(salary, maxWeeklyHours) * 2.5 // 150% extra
      );
    }

    // Recargo nnocturno (RC)
    if (horasExtrasDespues > 0 && !isSundayOrHoliday) {
      this.addExtraHour(
        extraHours,
        1,
        "RC",
        this.salaryCalculator.getLaboralHourSalary(salary, maxWeeklyHours) * 0.35 // 35% extra
      );
    }

    // Recargo dominical (RD)
    if (isSundayOrHoliday) {
      this.addExtraHour(
        extraHours,
        1,
        "RD",
        this.salaryCalculator.getLaboralHourSalary(salary, maxWeeklyHours) * 0.75 // 75% extra
      );
    }

    // REcargo dominical nocturno (RND)
    if (horasExtrasDespues > 0 && isSundayOrHoliday) {
      this.addExtraHour(
        extraHours,
        horasExtrasDespues,
        "RND",
        this.salaryCalculator.getLaboralHourSalary(salary, maxWeeklyHours) * 1.1 // 110% extra
      );
    }

    return extraHours;
  }

/**
   * Agrega una hora extra al array de horas extras
   * @param extraHours - Array donde se agregarán las horas extras
   * @param hours - Cantidad de horas
   * @param type - Tipo de hora extra
   * @param value - Valor por hora
   * 
   * proceso:
   * 1. Crea un objeto HourExtra con los parámetros dados
   * 2. Calcula el total multiplicando horas por valor
   * 3. Agrega el objeto al array
   */
  private addExtraHour(extraHours: HourExtra[], hours: number, type: string, value: number): void {
    extraHours.push({
      hour: hours,
      type,
      value,
      total: hours * value
    });
  }
}
export default new ExtraHoursService();