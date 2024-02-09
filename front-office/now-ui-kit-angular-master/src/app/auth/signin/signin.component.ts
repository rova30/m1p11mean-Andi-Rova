import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/api/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})

export class SignInComponent implements OnInit {

    data : Date = new Date();
    focus: boolean = false;
    focus1: boolean = false;
    loading: boolean = false;
    showSuccess: boolean = false;
    showError: boolean = false;

    customer = {
        lastname: '',
        firstname: '',
        contact: '',
        email: '',
        password: '',
    };

    constructor(private authService: AuthService) { }

    onSubmit() {
        this.loading = true;
        console.log('Données soumises : ', this.customer);
        this.authService.signInCustomer(this.customer.lastname, this.customer.firstname, this.customer.contact, this.customer.email, this.customer.password)
        .subscribe(
            (response) => {
                this.loading = false;
                Swal.fire({
                    icon: 'success',
                    title: response.message,
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = '/login';  
                });
            },
            (error) => {
                console.error('Inscription échouée', error);
                this.loading = false;
                Swal.fire({
                    icon: 'error',
                    title:'Erreur lors de l\'inscription',
                    text: error.response.data.message,
                    confirmButtonText: 'OK'
                });
            },
            () => {
              this.loading = false;
            }
        );         
    }

    ngOnInit() {
        var body = document.getElementsByTagName('body')[0];
        body.classList.add('signin-page');
    }

    ngOnDestroy(){
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('signin-page');
    }

}
