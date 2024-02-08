import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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

    constructor() { }    
    onSubmit() {
        this.loading = true;
        console.log('Données soumises : ', this.customer);
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
