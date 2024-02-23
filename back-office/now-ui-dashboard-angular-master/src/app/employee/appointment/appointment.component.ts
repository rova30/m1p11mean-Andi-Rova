import { Component, OnInit } from '@angular/core';
import * as employeeService from '../../api/employee.service';
import { AssignmentAppointmentService } from '../../api/assignmentappointment.service';
import * as moment from 'moment';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  employee: any;
  error: string;
  loading: boolean = false;
  dataAssignment: any; 

  constructor(private employeeService: employeeService.EmployeeService, private assignmentService: AssignmentAppointmentService) { }


  ngOnInit() {
    const token = sessionStorage.getItem('token_employee');
    this.getEmployee(token);
  }
  ngOnDestroy():void {
  }

  calculateTotalCost(appointment: any): number {
    let totalCost = 0;
    appointment.services.forEach(service => {
      totalCost += service.cost;
    });
    return totalCost;
  }  

  getEmployee(token: string) {
    this.loading = true;
    this.employeeService.getEmployeeByToken(token).subscribe(
      (data: any) => {
        this.employee = data.employee;
        this.loading = false;
        if (this.employee) {
          const statut = 2; 
          this.getAppointmentsAssignedByEmployeeId(this.employee._id, statut);
        } else {
          console.error('Employee is not defined yet.');
        }
      },
      (error: any) => {
        console.error('Error getting employee:', error);
        this.error = 'Error getting employee';
        this.loading = false;
        window.location.href = 'employee/login';
      }
    );
  }

  getAppointmentsAssignedByEmployeeId(employeeId: string,  statut: number) {
    this.loading = true;
    this.assignmentService.getassignedByEmployee(employeeId, statut).subscribe(
      (data: any) => {
        this.dataAssignment = data; 
     
        console.log(data);
        this.loading = false;
      },
      (error: any) => {
        console.error('Error getting appointments:', error);
        this.error = 'Error getting appointments';
        this.loading = false;
      }
    );
  }

}
