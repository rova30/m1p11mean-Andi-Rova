import { Component, OnInit } from '@angular/core';
import * as employeeService from '../../api/employee.service';
import { AssignmentAppointmentService } from '../../api/assignmentappointment.service';
import * as moment from 'moment';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  employee: any;
  error: string;
  loading: boolean = false;
  dataAssignment: any; 
  totalCommissionSum: number = 0;
  selectedDate: string; 

  constructor(private employeeService: employeeService.EmployeeService, private assignmentService: AssignmentAppointmentService) { }

  ngOnInit() {
    const token = sessionStorage.getItem('token_employee');
    this.getEmployee(token);
    this.selectedDate = new Date().toISOString().split('T')[0];
  }

  formatTime(dateTime: string): string {
    return moment(dateTime).format('HH:mm'); 
  }

  getEmployee(token: string) {
    this.loading = true;
    this.employeeService.getEmployeeByToken(token).subscribe(
      (data: any) => {
        this.employee = data.employee;
        this.loading = false;
        if (this.employee) {
          const statut = 2; 
          this.getAppointmentsByEmployeeId(this.employee._id, this.selectedDate, statut);
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

  getAppointmentsByEmployeeId(employeeId: string, date: string, statut: number) {
    this.loading = true;
    this.assignmentService.getassignmentByEmployee(employeeId, date, statut).subscribe(
      (data: any) => {
        this.dataAssignment = data; 
        this.totalCommissionSum = this.dataAssignment.reduce((acc, curr) => acc + curr.totalCommission, 0);
        this.loading = false;
      },
      (error: any) => {
        console.error('Error getting appointments:', error);
        this.error = 'Error getting appointments';
        this.loading = false;
      }
    );
  }

  onDateChange() {
    const statut = 2; 
    this.getAppointmentsByEmployeeId(this.employee._id, this.selectedDate, statut);
  }
}
