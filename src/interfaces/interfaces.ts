export interface SalaryDetailProps {
    extraHours: HourExtra[];
}

export interface HourExtra {
    hour: number;
    type: string;
    value: number;
    total: number;
}
export interface AccessControlEmployee {
    day: string;
    start: string;
    finish: string;
    hour_extra: HourExtra[] ;
    hour_worked: number;
}
export interface Schedule{
    day: string;
    start_at: string;
    finished_at: string;
    break_duration: number | string;
}
export interface EmployeesResponse {
    status: number;
    data: Employee[];
}

export interface Employee {
    workshifts: any;
    accessControls: any;
    first_name: any;
    last_name: any;
    type: "employee";
    id: number;
    attributes: EmployeeAttributes;
    relationships: EmployeeRelationships;
}

export interface EmployeeAttributes {
    [x: string]: any;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    charge: string;
    salary: number;
    created_at: Date;
    updated_at: Date;
}

export interface EmployeeRelationships {
    workshifts: Workshift[];
    accessControls: AccessControl[];
}

export interface Workshift {
    type: "workshift";
    id: number;
    attributes: WorkshiftAttributes;
    relationships: WorkshiftRelationships;
}

export interface WorkshiftAttributes {
    name: string;
    schedule_type: string;
    maximun_weekly_hours: number;
    created_at: Date;
    updated_at: Date;
}

export interface WorkshiftRelationships {
    workshiftDays: WorkshiftDay[];
}

export interface WorkshiftDay {
    type: "workshift_day";
    id: number;
    attributes: WorkshiftDayAttributes;
}

export interface WorkshiftDayAttributes {
    day: string;
    start_at: string;
    finished_at: string;
    break_time_start_at: string | null;
    break_time_finished_at: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface AccessControl {
    check_in(check_in: any): unknown;
    check_out(check_out: any): unknown;
    type: "access_control";
    id: number;
    attributes: AccessControlAttributes;
}

export interface AccessControlAttributes {
    check_in: Date;
    check_out: Date;
    created_at: Date;
    updated_at: Date;
}
