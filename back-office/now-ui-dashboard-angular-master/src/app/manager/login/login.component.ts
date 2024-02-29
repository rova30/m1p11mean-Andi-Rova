import { Component, OnInit } from '@angular/core';
import * as managerService from '../../api/manager.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-manager',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginManagerComponent implements OnInit {
  focus;
  focus1;
  focus2;
  loading: boolean = false;

  constructor(private managerService: managerService.ManagerService) { }

  loginData = {
    email: 'andi.nomenjanahary2003@gmail.com',
    password: 'andiK23'
};
  onSubmit() {
    this.loading = true;
    console.log('Données soumises : ', this.loginData);
    this.managerService.loginManager(this.loginData)
    .subscribe(
        (response) => {
            this.loading = false;
            console.log(response);
            sessionStorage.setItem('token_manager', response.token.token);
            Swal.fire({
                icon: 'success',
                title: response.message,
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                window.location.href = 'manager/dashboard';  
            });
        },
        (error) => {
            console.error('Connexion échouée', error);
            this.loading = false;
            Swal.fire({
                icon: 'error',
                title:'Erreur lors de la connsxion',
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
  }
  ngOnDestroy():void {
  }


}
