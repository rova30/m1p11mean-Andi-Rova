import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../api/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customers: any[] = [];
  error: string = '';
  currentPage: number = 1; 
  totalPages: number = 0; 
  pageSize: number = 10;
  
  loading: boolean = false;

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.loadCustomers();
    this.loadTotalCustomersCount();
  }
  ngOnDestroy():void {
  }

  loadCustomers() {
    this.error = '';
    this.loading = true;
  
    this.customerService.getCustomers(this.currentPage, this.pageSize).subscribe(
      (data: any[]) => {
        this.customers = data;
        this.loading = false;
      },
      (error: any) => {
        console.error('Error fetching customers:', error);
        this.error = 'Error fetching customers';
        this.loading = false;
      }
    );
  }

  loadTotalCustomersCount() {
    this.customerService.getTotalCustomersCount().subscribe(
      (count: number) => {
        this.totalPages = Math.ceil(count / this.pageSize);
      },
      (error: any) => {
        console.error('Error fetching total customers count:', error);
      }
    );
  }

  // Méthodes pour naviguer entre les pages
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCustomers();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCustomers();
    }
  }
}
