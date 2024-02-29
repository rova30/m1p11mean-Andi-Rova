import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ServiceService } from '../../api/service.service';
import Swal from 'sweetalert2';
import { AppointmentService } from 'app/api/appointment.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
})
export class ServiceComponent implements OnInit {
    data : Date = new Date();
    services: any[] = [];
    error: string = '';
    currentPage: number = 1;
    pageSize: number = 10;
    totalPages: number = 0;
    selectedService: any;
    loading: boolean = false;
    selectedServices: any[] = [];
    totalServicesDuration: number = 0;
    avalaibleDate: any[] = [];



    constructor(private serviceService: ServiceService,private appointmentService: AppointmentService) { }   
    ngOnInit() {
      this.getServices();
      this.getServicesCount();
    }

    getAvalaibleDate(deadline:number) {
      if(this.totalServicesDuration != 0){
        this.appointmentService.getAvailableDate(deadline).subscribe(
          (data: any[]) => {
            this.avalaibleDate = data;
          },
          (error: any) => {
            console.error('Error fetching avalaibleDate:', error);
            this.error = 'Error fetching avalaibleDate';
          }
        );
      }
    }

    getServicesCount() {
      this.serviceService.totalServicesCount().subscribe(
        (count: number) => {
          this.totalPages = Math.ceil(count / this.pageSize);
        },
        (error: any) => {
          console.error('Error fetching total Services count:', error);
        }
      );
    }




    getServices() {
    this.error = '';
    this.loading = true;

    this.serviceService.getServices(this.currentPage, this.pageSize).subscribe(
      (data: any[]) => {
        this.services = data;
        this.loading = false;
      },
      (error: any) => {
        console.error('Error fetching services:', error);
        this.error = 'Error fetching services';
        this.loading = false;
      }
    );
  }
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.getServices();
      }
    }
  
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.getServices();
      }
    }

    
    
  addService(selectedService: any) {
      this.selectedServices.push(selectedService);
      this.totalServicesDuration += selectedService.deadline;
      this.getAvalaibleDate(this.totalServicesDuration);

  }

  removeService(index: number,selectedService: any) {
    this.selectedServices.splice(index, 1);
    this.totalServicesDuration -= selectedService.deadline;
    this.getAvalaibleDate(this.totalServicesDuration);

  }



  ngOnDestroy(){
  }

}
