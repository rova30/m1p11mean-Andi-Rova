import { Component, OnInit } from '@angular/core';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/employee/profile', title: 'Profil',  icon: 'users_circle-08', class: '' },
  { path: '/employee/appointment', title: 'Rendez-vous',  icon: 'ui-1_calendar-60', class: '' },
  { path: '/employee/task', title: 'Tâches',  icon: 'design_app', class: '' },
];

@Component({
  selector: 'app-sidebar-employee',
  templateUrl: './sidebar-employee.component.html',
  styleUrls: ['./sidebar-employee.component.css']
})
export class SidebarEmployeeComponent implements OnInit {
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
