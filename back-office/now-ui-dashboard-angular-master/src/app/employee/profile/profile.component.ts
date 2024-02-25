import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../api/employee.service';
import { ServiceService } from '../../api/service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    employee: any;
    error: string;
    loading: boolean = false;
    dataEmployee: any; 
    services: any[] = [];
    selectedSpeciality: any;
    specialityExistsError: boolean = false;
  

  constructor(private employeeService: EmployeeService, private serviceService: ServiceService) { }

  ngOnInit() {
    const token = sessionStorage.getItem('token_employee');
    this.getEmployee(token);    
    this.loadServices();
  }

  loadServices() {
    this.serviceService.getServices(1, 100).subscribe(
      (data: any[]) => {
        this.services = data;
      },
      (error: any) => {
        console.error('Error fetching services:', error);
      }
    );
  }

  getEmployee(token: string) {
    this.loading = true;
    this.employeeService.getEmployeeByToken(token).subscribe(
      (data: any) => {
        this.employee = data.employee;
        this.loading = false;
        if (this.employee) {
          this.getInfoEmployee(this.employee._id);
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


  getInfoEmployee(employeeId: string) {
    this.loading = true;
    this.employeeService.infoByEmployee(employeeId).subscribe(
        (data: any) => {
            this.dataEmployee = data;
            
            console.log(data);
            this.loading = false;
        },
        (error: any) => {
            console.error('Error getting infos:', error);
            this.error = 'Error getting infos';
            this.loading = false;
        }
    );
  }

  addSpecialityToEmployee() {
    if (this.selectedSpeciality && this.employee && this.employee._id) {
      this.employeeService.addSpeciality(this.employee._id, this.selectedSpeciality).subscribe(
        (response: any) => {
          console.log('Speciality added successfully:', response);

          this.getInfoEmployee(this.employee._id);
        },
        (error: any) => {
          console.error('Error adding speciality:', error);

        }
      );
    }
  }

  checkSpecialityExistence(employeeId: string, specialityId: string) {
    this.employeeService.checkSpecialityExistence(employeeId, specialityId).subscribe(
      (data: any) => {
        if (data.exists) {
            this.specialityExistsError = true; 
        } else {
            this.specialityExistsError = false;
            this.addSpecialityToEmployee();
        }
      },
      (error: any) => {
        console.error('Error checking speciality existence:', error);

      }
    );
  }
}
