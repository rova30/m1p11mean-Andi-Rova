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
    this.getEmployees(1, 10);
  }

  getEmployees(page: number, pageSize: number) {
    this.error = ''; 
    this.loading = true;

    this.employeeService.getEmployees(page, pageSize).subscribe(
      (data: any[]) => {
        this.employees = data;
        this.currentPage = page; 
        this.totalPages = Math.ceil(data.length / pageSize);
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
    
    this.convertImageToBase64(this.employeeData.photo).then((base64Image: string) => {
      this.employeeData.photo = base64Image;  
      this.employeeService.addEmployee(this.employeeData).subscribe(
        (response) => {
          console.log('Employee added successfully:', response);
          this.resetForm();
          this.getEmployees(this.currentPage, 10); 
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
      this.getEmployees(this.currentPage - 1, 10); 
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.getEmployees(this.currentPage + 1, 10); 
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