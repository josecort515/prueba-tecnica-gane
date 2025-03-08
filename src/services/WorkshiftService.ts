import moment from "moment";
import { Employee, Schedule } from "../interfaces/interfaces";

//servicio para manejar los horarios, se encarga de la logica de negocio, tiene metodos para obtener las horas laboradas, el horario de trabajo, el horario de entrada y salida, el tiempo de almuerzo, las horas extras
class WorkshiftService {

  getWorkshtifType(employee: Employee): string {
    return employee.relationships.workshifts[0].attributes.name;
  }

  getWeekWorkedHours(employee: Employee): number {
    return employee.relationships.workshifts[0].attributes.maximun_weekly_hours;
  }

  getWeekSchedule(employee: Employee): Schedule[] {
    const horario: Schedule[] = [];
    const schedule: Schedule = {
      day: "",
      start_at: "",
      finished_at: "",
      break_duration: "",
    };
    //recorre los dias de la semana
    employee.relationships.workshifts[0].relationships.workshiftDays.forEach((day) => {
      schedule.day = this.getDay(day.attributes.day);
      schedule.start_at = day.attributes.start_at;
      schedule.finished_at = day.attributes.finished_at;
        if (day.attributes.break_time_start_at != null) {
          const inicio = moment(day.attributes.break_time_start_at);
          const final = moment(day.attributes.break_time_finished_at);
          const duration = moment.duration(final.diff(inicio));
          schedule.break_duration = duration.hours() + " horas";
        } else {
          schedule.break_duration = "No tiene";
        }
  
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

// const employee: Employee = {
//   // Initialize the employee object with valid data
//   relationships: {
//     workshifts: [
//       {
//         type: "workshift",
//         attributes: {
//           maximun_weekly_hours: 40,
//           name: "",
//           schedule_type: "",
//           created_at: new Date(),
//           updated_at: new Date()
//         },
//         relationships: {
//           workshiftDays: [
//             {
//               attributes: {
//                 day: "1",
//                 start_at: "09:00",
//                 finished_at: "17:00",
//                 break_time_start_at: "12:00",
//                 break_time_finished_at: "13:00",
//                 created_at: new Date(),
//                 updated_at: new Date()
//               },
//               type: "workshift_day",
//               id: 0
//             },
//             // Add other days as needed
//           ],
//         },
//         id: 0
//       },
//     ],
//     accessControls: []
//   },
//   type: "employee",
//   id: 0,
//   attributes: {
//     first_name: "",
//     last_name: "",
//     email: "",
//     phone: "",
//     charge: "",
//     salary: 0,
//     created_at: new Date(),
//     updated_at: new Date()
//   }
// };

export default new WorkshiftService();