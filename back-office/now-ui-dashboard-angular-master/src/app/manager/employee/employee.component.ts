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
}
