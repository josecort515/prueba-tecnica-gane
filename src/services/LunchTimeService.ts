import moment from "moment";


export class LunchTimeService {
  private static LUNCH_START = "12:00:00";
  private static LUNCH_END = "14:00:00";
  private static LUNCH_DURATION = 2;

/**
 * Calcula la deducción de tiempo por almuerzo basado en la hora de salida
 * @param checkOut - Objeto moment que representa la hora de salida del empleado
 * @returns 
 * - 2 horas: Si la hora de salida es después del período de almuerzo (14:00:00)
 * - 0 horas: Si la hora de salida está dentro del período de almuerzo (12:00:00 - 14:00:00) 
 *            o antes del período de almuerzo
 * 
 * proceso
 * 1. Define el período de almuerzo para la fecha dada (12:00:00 - 14:00:00)
 * 2. Si la salida es después de las 14:00, deduce 2 horas completas
 * 3. Si la salida está entre 12:00 y 14:00, calcula las horas
 * 4. Si la salida es antes de las 12:00, no hay deducción
 */
  static calculateLunchDeduction(checkOut: moment.Moment): number {
    const lunchStart = moment(`${checkOut.format("YYYY-MM-DD")} ${this.LUNCH_START}`);
    const lunchEnd = moment(`${checkOut.format("YYYY-MM-DD")} ${this.LUNCH_END}`);

    if (checkOut.isAfter(lunchEnd)) {
      return this.LUNCH_DURATION;
    }
    
    if (checkOut.isBetween(lunchStart, lunchEnd, undefined, "[)")) {
      const diffHours = checkOut.diff(lunchStart, 'hours', true);
      return Math.round(diffHours);
    }

    return 0;
  }
}
export default new LunchTimeService();