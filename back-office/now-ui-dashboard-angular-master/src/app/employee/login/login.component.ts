import { Component, OnInit } from '@angular/core';
import * as employeeService from '../../api/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-employee',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

})
export class LoginEmployeeComponent implements OnInit {
  focus;
  focus1;
  focus2;
  loading: boolean = false;
  constructor(private employeeService: employeeService.EmployeeService) { }

  loginData = {
    email: 'wonkaCha11@gmail.com',
    password: 'chocolat11'
};
  onSubmit() {
    this.loading = true;
    console.log('Données soumises : ', this.loginData);
    this.employeeService.loginEmployee(this.loginData)
    .subscribe(
        (response) => {
            this.loading = false;
            console.log(response);
            sessionStorage.setItem('token_employee', response.token.token);
            Swal.fire({
                icon: 'success',
                title: response.message,
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                window.location.href = 'employee/profile';  
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
  }

}
