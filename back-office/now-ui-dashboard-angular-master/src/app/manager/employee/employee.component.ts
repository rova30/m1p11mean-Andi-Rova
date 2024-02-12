import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../api/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employees: any[] = [];
  error: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  loading: boolean = false;
  employeeData: any = {
    firstName: '',
    lastName: '',
    address: '',
    contact: '',
    email: '',
    password: '',
    photo: null
  };

  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.getEmployeesCount();
  }

  getEmployeesCount() {
    this.employeeService.totalEmployeesCount().subscribe(
      (count: number) => {
        this.totalPages = Math.ceil(count / this.pageSize);
        this.getEmployees(this.currentPage, this.pageSize);
      },
      (error: any) => {
        console.error('Error fetching total employees count:', error);
      }
    );
  }

  getEmployees(page: number, pageSize: number) {
    this.error = '';
    this.loading = true;

    this.employeeService.getEmployees(page, pageSize).subscribe(
      (data: any[]) => {
        this.employees = data;
        this.currentPage = page;
        this.loading = false;
      },
      (error: any) => {
        console.error('Error fetching employees:', error);
        this.error = 'Error fetching employees';
        this.loading = false;
      }
    );
  }

  addEmployee() {
    // Convertir l'image en base64 avant de l'ajouter
    this.convertImageToBase64(this.employeeData.photo).then((base64Image: string) => {
      this.employeeData.photo = base64Image;
      this.employeeService.addEmployee(this.employeeData).subscribe(
        (response) => {
          console.log('Employee added successfully:', response);
          this.resetForm();
          this.getEmployees(this.currentPage, this.pageSize);
        },
        (error) => {
          console.error('Error adding employee:', error);
        }
      );
    }).catch((error) => {
      console.error('Error converting image to base64:', error);
    });
  }

  resetForm() {
    this.employeeData = {
      firstName: '',
      lastName: '',
      address: '',
      contact: '',
      email: '',
      password: '',
      photo: null
    };
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.getEmployees(this.currentPage - 1, this.pageSize);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.getEmployees(this.currentPage + 1, this.pageSize);
    }
  }

  onFileSelected(event: any) {
    this.employeeData.photo = event.target.files[0];
  }


  convertImageToBase64(imageFile: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }
  ngOnDestroy():void {
  }

}
