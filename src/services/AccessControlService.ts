import { Employee, AccessControlEmployee, AccessControl, HourExtra, AccessControlAttributes, WorkshiftDayAttributes, Workshift } from "../interfaces/interfaces";
import moment from "moment";
import WorkshiftService from "./WorkshiftService";

class AccessControlService {

  // permitir que se puedan tener varios tipos de horas extras en un solo dia

  getLaboralHourSalary(salary: number, weekWorkedHours: number): number {
    // Calcula el salario diario de un empleado
    const workedHours = weekWorkedHours / 6;
    const value = workedHours * 30
    const dailySalary = salary / value;
    return dailySalary;
  }

  nocRecharge(salary: number, weekWorkedHours: number): number {
    const recargoNoc = this.getLaboralHourSalary(salary, weekWorkedHours) + (this.getLaboralHourSalary(salary, weekWorkedHours) * 0.35);
    return recargoNoc;
  }

  rechargeDomincal(salary: number, weekWorkedHours: number): number {
    const horaRecargoDom = this.getLaboralHourSalary(salary, weekWorkedHours) + (this.getLaboralHourSalary(salary, weekWorkedHours) * 0.75);
    return horaRecargoDom;
  }

  diurnalExtraHour(salary: number, weekWorkedHours: number): number {
    const horaExtraDiurna = this.getLaboralHourSalary(salary, weekWorkedHours) + (this.getLaboralHourSalary(salary, weekWorkedHours) * 0.25);
    return horaExtraDiurna;
  }

  nocturnExtraHour(salary: number, weekWorkedHours: number): number {
    const horaExtraDiurna = this.getLaboralHourSalary(salary, weekWorkedHours) + (this.getLaboralHourSalary(salary, weekWorkedHours) * 0.25);
    return horaExtraDiurna;
  }


  y
    let horasExtras = salidaControl.diff(horarioSalida, 'hours', true);

    // Descontar el tiempo de almuerzo si aplica
    if (salidaControl.isAfter(almuerzoInicio)) {
      if (horarioSalida.isBefore(almuerzoInicio)) {
        // Si el horario de salida es antes del almuerzo
        if (salidaControl.isAfter(almuerzoFin)) {
          // Si la salida es después del almuerzo, descontar 2 horas
          horasExtras -= 2;
        } else {
          // Si la salida es durante el almuerzo, descontar el tiempo hasta la salida
          horasExtras -= salidaControl.diff(almuerzoInicio, 'hours', true);
        }
      } else if (horarioSalida.isBetween(almuerzoInicio, almuerzoFin)) {
        // Si el horario de salida es durante el almuerzo
        if (salidaControl.isAfter(almuerzoFin)) {
          // Descontar el tiempo desde el horario de salida hasta el fin del almuerzo
          horasExtras -= almuerzoFin.diff(horarioSalida, 'hours', true);
        }
      }
    }

    return Math.max(0, Math.round(horasExtras));
  }

  getWorkedHoursForDay(accessControl: AccessControl, workshift: Workshift) {
    const checkIn = moment(accessControl.attributes.check_in);
    const checkOut = moment(accessControl.attributes.check_out);
    const duration = moment.duration(checkOut.diff(checkIn));
    switch (workshift.attributes.schedule_type) {
      //Fixed: Horario fijo de Lunes a Viernes de 08:00 a 18:00 con un descanso de 12:00 a 14:00 y Sabado de 08:00 a 12:00
      case "fixed":
        return Math.round(duration.asHours() - 2);
        break;
      // Fixed_halftime: Horario fijo de medio tiempo de Lunes a Viernes de 08:00 a 12:00
      case "fixed_halftime":
        return Math.round(duration.asHours());

        break;
      // Flexible: Horario rotativo no tiene día ni hora entrada establecido pero se toma 2 horas de 12:00 a 2:00.
      case "fexible":
        return Math.round(duration.asHours() - 2);
        break;
      //horario incorrecto
      default:
        break;
    }
  }

  getAllWorkedHours(employee: Employee): number {
    // Calcula las horas trabajadas en la semana
    let workedHours = 0;
    employee.relationships.accessControls.forEach((accessControl) => {
      workedHours += this.getWorkedHoursForDay(accessControl, employee.relationships.workshifts[0])!;
    });
    return Math.round(workedHours);
  }

  getAllAccessControl(employee: Employee): AccessControlEmployee[] {
    const controlAceso: AccessControlEmployee[] = [];
    employee.relationships.accessControls.forEach((accessControl) => {
      const dia = WorkshiftService.getDay(moment(accessControl.attributes.check_out).format('d'));
      let hourExtra: HourExtra[] = [];
      //si el el empleado si tiene horario
      if (employee.relationships.workshifts[0].relationships.workshiftDays.length > 0) {
        hourExtra = this.getHourExtraType(accessControl.attributes,
          employee.relationships.workshifts[0].relationships.workshiftDays[0].attributes,
          employee.attributes.salary,
          employee.relationships.workshifts[0].attributes.maximun_weekly_hours);
      }

      const control: AccessControlEmployee = {
        day: dia,
        start: moment(accessControl.attributes.check_in).format('MMMM Do YYYY, h:mm:ss a'),
        finish: moment(accessControl.attributes.check_out).format('MMMM Do YYYY, h:mm:ss a'),
        hour_extra: hourExtra,
        hour_worked: this.getWorkedHoursForDay(accessControl, employee.relationships.workshifts[0])!
      };

      controlAceso.push(control);
    });
    return controlAceso;
  }

  getAllExtraHours(employee: Employee): number {
    let extraHours = 0;

    employee.relationships.accessControls.forEach((accessControl) => {
      const horaSalidaControl = accessControl.attributes.check_out.toString();

      switch (employee.relationships.workshifts[0].attributes.schedule_type) {
        case "fixed":
          extraHours += this.getHourExtra("18:00:00", horaSalidaControl);
          break;
        case "fixed_halftime":
          extraHours += this.getHourExtra("12:00:00", horaSalidaControl);
          break;
        case "fexible":
          extraHours += this.getHourExtra("02:00:00", horaSalidaControl);
          break;
        default:
          break;
      }
    });
    // console.log(extraHours);
    return Math.round(extraHours);

  }

  calcularHorasExtras(
    fechaSalidaRealStr: string,
    horaSalidaNormalStr: string
  ): { horasExtrasAntes: number; horasExtrasDespues: number } {
    const fechaSalidaReal = moment(fechaSalidaRealStr);
    const fechaSalidaNormal = moment(horaSalidaNormalStr);
    const fecha = fechaSalidaReal.format('YYYY-MM-DD');
    const inicioRecargoNocturno = moment(`${fecha} 19:00:00`);

    let horasExtrasAntes = 0;
    let horasExtrasDespues = 0;

    if (fechaSalidaReal.isAfter(fechaSalidaNormal)) {
      if (fechaSalidaReal.isSameOrBefore(inicioRecargoNocturno)) {
        // Todas las horas extras son antes del recargo nocturno
        horasExtrasAntes = fechaSalidaReal.diff(fechaSalidaNormal, 'hours', true);
      } else {
        // Parte de las horas extras son antes y parte después del recargo nocturno
        if (fechaSalidaNormal.isBefore(inicioRecargoNocturno)) {
          horasExtrasAntes = inicioRecargoNocturno.diff(fechaSalidaNormal, 'hours', true);
          horasExtrasDespues = fechaSalidaReal.diff(inicioRecargoNocturno, 'hours', true);
        } else {
          // Si la hora normal de salida es después de las 21:00, todas son nocturnas
          horasExtrasDespues = fechaSalidaReal.diff(fechaSalidaNormal, 'hours', true);
        }
      }
    }

    return {
      horasExtrasAntes: Math.round(horasExtrasAntes),
      horasExtrasDespues: Math.round(horasExtrasDespues),
    };
  }

  getHourExtraType(
    accessControlAttributes: AccessControlAttributes, workshiftDays: WorkshiftDayAttributes, salary: number, maximun_weekly_hours: number): HourExtra[] {
    const extraHours: HourExtra[] = [];
    const checkOut = moment(accessControlAttributes.check_out);
    const dayOfWeek = checkOut.isoWeekday();

    const finishedAt = moment(`${checkOut.format("YYYY-MM-DD")} ${workshiftDays.finished_at}`, "YYYY-MM-DD HH:mm:ss");
    let extraHourCount = checkOut.diff(finishedAt, "hours", true);

    if (extraHourCount <= 0) return extraHours;

    // Verificar pausa
    if (workshiftDays.break_time_start_at && workshiftDays.break_time_finished_at) {
      const breakStart = moment(`${checkOut.format("YYYY-MM-DD")} ${workshiftDays.break_time_start_at}`, "YYYY-MM-DD HH:mm:ss");
      const breakEnd = moment(`${checkOut.format("YYYY-MM-DD")} ${workshiftDays.break_time_finished_at}`, "YYYY-MM-DD HH:mm:ss");

      if (checkOut.isBetween(breakStart, breakEnd, undefined, "[)")) {
        return extraHours;
      }
    }

    const isSundayOrHoliday = dayOfWeek === 7;
    const { horasExtrasAntes, horasExtrasDespues } = this.calcularHorasExtras(
      checkOut.format(),
      finishedAt.format()
    );

    // Agregar horas extras diurnas si existen
    if (horasExtrasAntes > 0) {
      extraHours.push({
        hour: horasExtrasAntes,
        type: isSundayOrHoliday ? "HEDD" : "HED",
        value: this.getLaboralHourSalary(salary, maximun_weekly_hours),
        total: horasExtrasAntes * this.getLaboralHourSalary(salary, maximun_weekly_hours)
      });
    }

    // Agregar horas extras nocturnas si existen
    if (horasExtrasDespues > 0) {
      extraHours.push({
        hour: horasExtrasDespues,
        type: isSundayOrHoliday ? "HEDN" : "HEN",
        value: this.nocturnExtraHour(salary, maximun_weekly_hours),
        total: horasExtrasDespues * this.nocturnExtraHour(salary, maximun_weekly_hours)
      });
    }

    // Agregar recargo nocturno
    if (horasExtrasDespues > 0) {
      extraHours.push({
        hour: 1,
        type: isSundayOrHoliday ? "RND" : "RC",
        value: this.nocRecharge(salary, maximun_weekly_hours),
        total: 1 * this.nocturnExtraHour(salary, maximun_weekly_hours)
      });
    }

    // Agregar recargo dominical si aplica
    if (isSundayOrHoliday) {
      extraHours.push({
        hour: 1,
        type: "RD",
        value: this.rechargeDomincal(salary, maximun_weekly_hours),
        total: 1 * this.rechargeDomincal(salary, maximun_weekly_hours)
      });
    }

    return extraHours;
  }
}

export default new AccessControlService();