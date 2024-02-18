import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/api/auth.service';
import Swal from 'sweetalert2';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { getMessaging, getToken } from 'firebase/messaging';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

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
        const messaging = getMessaging();
        getToken(messaging,{vapidKey: environment.firebase.vapidKey}).then(
            (currentToken) => {
                if(currentToken){
                    console.log("I have token");
                    this.authService.signInCustomer(this.customer.lastname, this.customer.firstname, this.customer.contact, this.customer.email, this.customer.password,currentToken)
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
                                this.sendWelcomeEmail().subscribe(
                                    (response) => {
                                        window.location.href = '/login';
                                    },
                                    (error) => {
                                        console.error('Erreur lors de l\'exécution de sendWelcomeEmail:', error);
                                    }
                                );
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
                }else{
                    console.log("we have a problem")
                }
            }
        )

    }

    sendWelcomeEmail(): Observable<any> {
        return new Observable((observer) => {
            const emailParams = {
                to_email: this.customer.email,
                to_name: this.customer.firstname,
            };
    
            emailjs.send('service_o16fab1', 'template_mc0zi4c', emailParams, 'zyttBXTLr2H2AlESY')
                .then((response: EmailJSResponseStatus) => {
                    console.log('E-mail envoyé avec succès:', response);
                    observer.next(response);
                    observer.complete();
                }, (error) => {
                    console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
                    observer.error(error);
                });
        });
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
