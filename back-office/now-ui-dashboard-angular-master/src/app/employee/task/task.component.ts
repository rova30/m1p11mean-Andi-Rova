// task.component.ts
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
  dataAssignment: any; // Variable pour stocker les données
  totalCommissionSum: number = 0;


  constructor(private employeeService: employeeService.EmployeeService, private assignmentService: AssignmentAppointmentService) { }

  ngOnInit() {
    const token = sessionStorage.getItem('token_employee');
    this.getEmployee(token);
  }

  formatTime(dateTime: string): string {
    // Utiliser moment.js pour formater la date
    return moment(dateTime).format('HH:mm'); // 'HH:mm' pour afficher l'heure au format 24h
  }

  getEmployee(token: string) {
    this.loading = true;
    this.employeeService.getEmployeeByToken(token).subscribe(
      (data: any) => {
        this.employee = data.employee;
        this.loading = false;
        if (this.employee) {
          const today = new Date().toISOString().split('T')[0]; // Obtenez la date au format YYYY-MM-DD
          const statut = 0; // Changez le statut selon vos besoins
          this.getAppointmentsByEmployeeId(this.employee._id, today, statut);
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
        this.dataAssignment = data; // Stockez les données récupérées
        this.totalCommissionSum = this.dataAssignment.reduce((acc, curr) => acc + curr.totalCommission, 0);
     
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
