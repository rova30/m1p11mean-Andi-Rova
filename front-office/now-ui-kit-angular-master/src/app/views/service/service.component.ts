import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ServiceService } from '../../api/service.service';
import Swal from 'sweetalert2';
import { AppointmentService } from 'app/api/appointment.service';
import { CommonModule  } from '@angular/common';

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
    formattedData: any[] = [];


    constructor(private serviceService: ServiceService,private appointmentService: AppointmentService) {
     }   
    ngOnInit() {
      this.getServices();
      this.getServicesCount();

    }

    formatData(data: any[]) {
      this.formattedData = [];
  
      data.forEach((jour) => {
        const jourIndex = Object.keys(jour)[0];
        const heures = jour[jourIndex];
  
        const formattedHeures = heures.map((heure: string) => {
          return new Date(heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        });
  
        this.formattedData.push({
          jour: new Date(heures[0]).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          heures: formattedHeures,
        });

        console.log(this.formattedData)
      });
    }

    
    afficherDateHeure(jour: string, heure: string) {
      // Concaténer la date et l'heure
      const dateHeureSelectionnee = `${jour} ${heure}`;
    
      // Convertir la chaîne en objet Date
      const dateObj = new Date(dateHeureSelectionnee);
    
      // Extraire les composants de la date
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Les mois sont de 0 à 11, donc on ajoute 1 et on remplit éventuellement avec un zéro à gauche
      const day = String(dateObj.getDate()).padStart(2, '0');
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    
      // Formater la date au format 'yyyy-MM-dd HH:mm'
      const dateFormatee = `${year}-${month}-${day} ${hours}:${minutes}`;
    
      console.log(dateFormatee);
    }
    
    
    getAvalaibleDate(deadline:number) {
      if(this.totalServicesDuration != 0){
        this.appointmentService.getAvailableDate(deadline).subscribe(
          (data: any[]) => {
            this.avalaibleDate = data;
            this.formatData(this.avalaibleDate);
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
