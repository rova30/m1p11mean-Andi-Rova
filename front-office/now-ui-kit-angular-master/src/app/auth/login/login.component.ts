import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import * as authService from '../../api/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {

    data : Date = new Date();
    focus: boolean = false;
    focus1: boolean = false;
    loading: boolean = false;
    showSuccess: boolean = false;
    showError: boolean = false;


    customer = {
        email: '',
        password: '',
    };

    constructor(private authService: authService.AuthService) { }    
    onSubmit() {
        this.loading = true;
        console.log('Données soumises : ', this.customer);
        this.authService.loginCustomer(this.customer)
        .subscribe(
            (response) => {
                this.loading = false;
                console.log(response);
                sessionStorage.setItem('token_customer', response.token.token);
                Swal.fire({
                    icon: 'success',
                    title: response.message,
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'index';  
                });
            },
            (error) => {
                console.error('Connexion échouée', error);
                this.loading = false;
                Swal.fire({
                    icon: 'error',
                    title:'Erreur lors de la connexion',
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
        body.classList.add('login-page');
    }
    ngOnDestroy(){
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');
    }

}
