import { AccessControlEmployee } from "../interfaces/interfaces";

/**
 * Clase de servicio para calcular varios tipos de valores relacionados con el salario
 */
export class SalaryCalculatorService {
  /**
   * Calcula la tarifa base del salario por hora
   * @param salary - El monto del salario base mensual
   * @param weekWorkedHours - Número de horas trabajadas por semana
   * @returns La tarifa base del salario por hora
   * @process 
   * 1. Calcula las horas trabajadas diarias dividiendo las horas semanales entre 6
   * 2. Multiplica las horas diarias por 30 para obtener las horas mensuales
   * 3. Divide el salario mensual entre el total de horas mensuales
   */
  getLaboralHourSalary(salary: number, weekWorkedHours: number): number {
    const workedHours = weekWorkedHours / 6;
    const value = workedHours * 30;
    return salary / value;
  }

  /**
   * Calcula el salario total a devengar sumando el salario base más las horas extras
   * @param salary - Salario base del empleado
   * @param hoursExtra - Array de registros de control de acceso del empleado que contiene las horas extras
   * @returns El salario total a devengar (salario base + total de horas extras)
   * 
   * proceso
   * 1. Calcula la suma total de todas las horas extras usando reduce anidados
   * 2. Suma el total de horas extras al salario base
   * 3. Retorna el resultado final
   */
  salarioDevengar(salary: number, hoursExtra: AccessControlEmployee[]):number {
    const extraTotal = hoursExtra.reduce((total, acc) => {
      return total + acc.hour_extra.reduce((subtotal, t) => {
        return subtotal + t.total;
      }, 0);
    }, 0);

    return salary + extraTotal;
  }

  /**
     * Calcula el recargo por trabajo nocturno (35% extra)
     * @param baseSalary - El monto del salario base mensual
     * @param weekWorkedHours - Número de horas trabajadas por semana
     * @returns La tarifa por hora para trabajo nocturno
     * @process
     * 1. Obtiene la tarifa base por hora
     * 2. Aplica un aumento del 35% (multiplica por 1.35)
     */
  nocRecharge(baseSalary: number, weekWorkedHours: number): number {
    const baseHourSalary = this.getLaboralHourSalary(baseSalary, weekWorkedHours);
    return baseHourSalary * 1.35;
  }

  /**
     * Calcula el recargo por trabajo dominical/festivo (75% extra)
     * @param baseSalary - El monto del salario base mensual
     * @param weekWorkedHours - Número de horas trabajadas por semana
     * @returns La tarifa por hora para trabajo dominical/festivo
     * @process
     * 1. Obtiene la tarifa base por hora
     * 2. Aplica un aumento del 75% (multiplica por 1.75)
     */
  rechargeDomincal(baseSalary: number, weekWorkedHours: number): number {
    const baseHourSalary = this.getLaboralHourSalary(baseSalary, weekWorkedHours);
    return baseHourSalary * 1.75;
  }

  /**
     * Calcula la tarifa de hora extra diurna (25% extra)
     * @param baseSalary - El monto del salario base mensual
     * @param weekWorkedHours - Número de horas trabajadas por semana
     * @returns La tarifa por hora para horas extra diurnas
     * @process
     * 1. Obtiene la tarifa base por hora
     * 2. Aplica un aumento del 25% (multiplica por 1.25)
     */
  diurnalExtraHour(baseSalary: number, weekWorkedHours: number): number {
    const baseHourSalary = this.getLaboralHourSalary(baseSalary, weekWorkedHours);
    return baseHourSalary * 1.25;
  }
  
  /**
     * Calcula la tarifa de hora extra nocturna (igual que la diurna)
     * @param baseSalary - El monto del salario base mensual
     * @param weekWorkedHours - Número de horas trabajadas por semana
     * @returns La tarifa por hora para horas extra nocturnas
     * @process
     * Retorna el mismo valor que la hora extra diurna
     */
  nocturnExtraHour(baseSalary: number, weekWorkedHours: number): number {
    return this.diurnalExtraHour(baseSalary, weekWorkedHours);
  }
}

export default new SalaryCalculatorService();