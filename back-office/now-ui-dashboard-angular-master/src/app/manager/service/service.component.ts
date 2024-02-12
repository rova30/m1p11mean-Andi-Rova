import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../api/service.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
    services: any[] = [];
    error: string = '';
    currentPage: number = 1;
    pageSize: number = 10;
    totalPages: number = 0;
  
    loading: boolean = false;
    serviceData: any = {
      name: '',
      deadline: '',
      cost: '',
      commission: ''
    };
  
    constructor(private serviceService: ServiceService) { }
  
    ngOnInit() {
      this.getServicesCount();
    }
  
    getServicesCount() {
      this.serviceService.totalServicesCount().subscribe(
        (count: number) => {
          this.totalPages = Math.ceil(count / this.pageSize);
          this.getServices(this.currentPage, this.pageSize);
        },
        (error: any) => {
          console.error('Error fetching total Services count:', error);
        }
      );
    }
  
    getServices(page: number, pageSize: number) {
      this.error = '';
      this.loading = true;
  
      this.serviceService.getServices(page, pageSize).subscribe(
        (data: any[]) => {
          this.services = data;
          this.currentPage = page;
          this.loading = false;
        },
        (error: any) => {
          console.error('Error fetching services:', error);
          this.error = 'Error fetching services';
          this.loading = false;
        }
      );
    }
  
    addService() {
        this.serviceService.addService(this.serviceData).subscribe(
          (response) => {
            console.log('service added successfully:', response);
            this.resetForm();
            this.getServices(this.currentPage, this.pageSize);
          },
          (error) => {
            console.error('Error adding service:', error);
           
          }
        );
      }


  
    resetForm() {
      this.serviceData = {
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
        this.getServices(this.currentPage - 1, this.pageSize);
      }
    }
  
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.getServices(this.currentPage + 1, this.pageSize);
      }
    }
  
}