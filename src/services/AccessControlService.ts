import moment from "moment";
import { AccessControl, Employee, AccessControlEmployee } from "../interfaces/interfaces";

class AccessControlService {

  getAllAccessControl(employee: Employee): AccessControlEmployee[] {
    const controlAceso: AccessControlEmployee[] = [];
    employee.relationships.accessControls.map((accessControl) => {
      const control: AccessControlEmployee = {
        start: moment(accessControl.attributes.check_in).format("MMM Do YY"),
        finish: moment(accessControl.attributes.check_out).format("MMM Do YY"),
        hour_extra: moment(accessControl.attributes.check_out).diff(moment(accessControl.attributes.check_in), 'hours').toString()
      };
      controlAceso.push(control);
    });
    return controlAceso;
  }
}

export default new AccessControlService();