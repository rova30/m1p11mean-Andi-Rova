import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import * as authService from '../../api/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
    private toggleButton: any;
    private sidebarVisible: boolean;
    customer: any;
    error:string;
    loading: boolean = false;

    constructor(public location: Location, private element : ElementRef,private authService: authService.AuthService) {
        this.sidebarVisible = false;
    }

    getCustomer(token:string) {
        this.loading = true;
        this.authService.getCustomerByToken(token).subscribe(
          (data: any) => {
            this.customer = data.customer;
            this.loading = false;
            console.log(data)
          },
          (error: any) => {
            console.error('Error getting customer:', error);
            this.error = 'Error getting customer'; 
            this.loading = false;
          }
        );
      }
  

    ngOnInit() {
        const token = sessionStorage.getItem('token_customer');
        this.getCustomer(token);  
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };
  
    isDocumentation() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if( titlee === '/documentation' ) {
            return true;
        }
        else {
            return false;
        }
    }
}
