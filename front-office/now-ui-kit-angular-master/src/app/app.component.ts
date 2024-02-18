import { Component, OnInit, Inject, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Location } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { filter, Subscription } from 'rxjs';
import {getMessaging, getToken} from 'firebase/messaging';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    private _router: Subscription;
    @ViewChild(NavbarComponent) navbar: NavbarComponent;

    constructor( private renderer : Renderer2, private router: Router, @Inject(DOCUMENT,) private document: any, private element : ElementRef, public location: Location) {}

    ngOnInit() {
    this.requestPermission();
    var navbar : HTMLElement = this.element.nativeElement.children[0].children[0];
        // Ajouter une condition initiale pour gérer la visibilité du navbar
    if (this.location.path() === '/login' || this.location.path() === '/signin') {
        navbar.classList.remove('navbar-transparent');
        navbar.style.display = 'none'; // Masquer le navbar si la route est "/login"
    }

    this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
        if (window.outerWidth > 991) {
            window.document.children[0].scrollTop = 0;
        } else {
            window.document.activeElement.scrollTop = 0;
        }
        this.navbar.sidebarClose();

        // Déplacer la condition pour gérer la visibilité du navbar en dehors de l'écouteur d'événements de défilement
        if (this.location.path() === '/login' ||this.location.path() === '/signin') {
            navbar.style.display = 'none'; // Masquer le navbar si la route est "/login"
        } else {
            navbar.style.display = 'block'; // Afficher le navbar pour les autres routes
        }
    });
        this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            if (window.outerWidth > 991) {
                window.document.children[0].scrollTop = 0;
            }else{
                window.document.activeElement.scrollTop = 0;
            }
            this.navbar.sidebarClose();

            this.renderer.listen('window', 'scroll', (event) => {
                const number = window.scrollY;
                var _location = this.location.path();
                _location = _location.split('/')[2];

                if (number > 150 || window.pageYOffset > 150) {
                    navbar.classList.remove('navbar-transparent');
                } else if (_location !== 'login' && this.location.path() !== '/nucleoicons') {
                    // remove logic
                    navbar.classList.add('navbar-transparent');
                }
            
            });
        });
    }
    requestPermission() {
        const messaging = getMessaging();
        getToken(messaging,{vapidKey: environment.firebase.vapidKey}).then(
            (currentToken) => {
                if(currentToken){
                    console.log("I have token");
                    console.log(currentToken);
                }else{
                    console.log("we have a problem")
                }
            }
        )
    }


}
