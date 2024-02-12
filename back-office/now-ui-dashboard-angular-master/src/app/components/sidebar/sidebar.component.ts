import { Component, OnInit } from '@angular/core';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/manager/dashboard', title: 'Tableau de bord',  icon: 'design_app', class: '' },
    { path: '/manager/service', title: 'Services',  icon:'design_bullet-list-67', class: '' },
    { path: '/manager/specialoffer', title: 'Offre spécial',  icon:'design_bullet-list-67', class: '' },
    { path: '/manager/customer', title: 'Clients',  icon:'users_circle-08', class: '' },
    { path: '/manager/employee', title: 'Employés',  icon:'users_circle-08', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };
}
