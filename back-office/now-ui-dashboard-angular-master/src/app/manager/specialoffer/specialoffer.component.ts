import { Component, OnInit } from '@angular/core';
import { SpecialOfferService } from '../../api/specialoffer.service';
import { ServiceService } from '../../api/service.service';

@Component({
  selector: 'app-specialoffer',
  templateUrl: './specialoffer.component.html',
  styleUrls: ['./specialoffer.component.css']
})
export class SpecialOfferComponent implements OnInit {
  specialOffers: any[] = [];
  error: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  loading: boolean = false;
  serviceData: any = {
    name: '',
    description: '',
    reduction: '',
    price: '',
    dateStart: '',
    dateEnd: '',
    services: []
  };

  selectedService: any;
  services: any[] = [];

  constructor(private specialOfferService: SpecialOfferService, private serviceService: ServiceService) {}

  ngOnInit() {
    this.getSpecialOffersCount();
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

  addService() {
    if (this.selectedService) {
      this.serviceData.services.push(this.selectedService);
      this.selectedService = null;
    }
  }

  removeService(index: number) {
    this.serviceData.services.splice(index, 1);
  }

  getSpecialOffersCount() {
    this.specialOfferService.totalSpecialOffersCount().subscribe(
      (count: number) => {
        this.totalPages = Math.ceil(count / this.pageSize);
        this.getSpecialOffers(this.currentPage, this.pageSize);
      },
      (error: any) => {
        console.error('Error fetching total specialOffers count:', error);
      }
    );
  }

  getSpecialOffers(page: number, pageSize: number) {
    this.error = '';
    this.loading = true;

    this.specialOfferService.getSpecialOffers(page, pageSize).subscribe(
      (data: any[]) => {
        this.specialOffers = data;
        this.currentPage = page;
        this.loading = false;
      },
      (error: any) => {
        console.error('Error fetching specialOffers:', error);
        this.error = 'Error fetching specialOffers';
        this.loading = false;
      }
    );
  }

  addSpecialOffer() {
    this.specialOfferService.addSpecialOffer(this.serviceData).subscribe(
      (response) => {
        console.log('service added successfully:', response);
        this.resetForm();
        this.getSpecialOffers(this.currentPage, this.pageSize);
      },
      (error) => {
        console.error('Error adding service:', error);
      }
    );
  }

  isExpired(dateEnd: string): boolean {
    const now = new Date();
    const endDate = new Date(dateEnd);
    return endDate < now;
  }

  resetForm() {
    this.serviceData = {
      name: '',
      description: '',
      reduction: '',
      price: '',
      dateStart: '',
      dateEnd: '',
      services: []
    };
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.getSpecialOffers(this.currentPage - 1, this.pageSize);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.getSpecialOffers(this.currentPage + 1, this.pageSize);
    }
  }
}
