import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  selectedAppointment: any; 
  newDateTime: string; 
  errorMessage: string = '';

  @ViewChild('detailAppointment') detailAppointment: ElementRef;

  constructor(private employeeService: employeeService.EmployeeService, private assignmentService: AssignmentAppointmentService) { }

  ngOnInit() {
    const token = sessionStorage.getItem('token_employee');
    this.getEmployee(token);
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
          const statut = 0;
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

  getAppointmentsAssignedByEmployeeId(employeeId: string, statut: number) {
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

  openModal(appointment: any) {
    this.selectedAppointment = appointment;
    this.selectedAppointment.assignments.forEach(assignment => {
      assignment.newDateTime = null;
    });
    const modal = this.detailAppointment.nativeElement as HTMLElement;
    modal.classList.add('show');
    modal.style.display = 'block';
  }
  closeModal() {
    const modal = this.detailAppointment.nativeElement as HTMLElement;
    modal.classList.remove('show');
    modal.style.display = 'none';
  }

  updateAssignmentDateTimeEnd(appointmentId: string, assignmentId: string, newDateTime: Date): void {
    this.assignmentService.updateAssignmentDateTimeEnd(appointmentId, assignmentId, newDateTime).subscribe(
      (response) => {
        console.log('Date de l\'assignation mise à jour avec succès :', response);

        const token = sessionStorage.getItem('token_employee');
        this.getEmployee(token);      
        const modal = this.detailAppointment.nativeElement as HTMLElement;
        modal.classList.remove('show');
        modal.style.display = 'none';
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la date de l\'assignation :', error);
      }
    );
  }


  completeAssignment(appointmentId: string, assignmentId: string): void {
    if (this.checkDateFieldsFilled()) {
      this.assignmentService.updateAssignmentStatus(appointmentId, assignmentId, 2).subscribe(
        (response) => {
          console.log('Statut de l\'assignation mis à jour avec succès :', response);
          const token = sessionStorage.getItem('token_employee');
          this.getEmployee(token);      
          const modal = this.detailAppointment.nativeElement as HTMLElement;
          modal.classList.remove('show');
          modal.style.display = 'none';
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du statut de l\'assignation :', error);
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir d\'abord les champs de dates.';
    }
  }

  cancelAssignment(appointmentId: string, assignmentId: string): void {
    this.assignmentService.updateAssignmentStatus(appointmentId, assignmentId, 7).subscribe(
      (response) => {
        console.log('Statut de l\'assignation mis à jour avec succès :', response);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du statut de l\'assignation :', error);
      }
    );
  }

  // Méthode pour vérifier si les champs de dates sont remplis
  checkDateFieldsFilled(): boolean {
    return this.selectedAppointment.assignments.every(assignment => assignment[5] !== null && assignment[6] !== null);
  }
  
}

