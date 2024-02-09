import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarEmployeeComponent } from './sidebar-employee/sidebar-employee.component';
import { NavbarEmployeeComponent } from './navbar-employee/navbar-employee.component';
import { FooterEmployeeComponent } from './footer-employee/footer-employee.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    SidebarEmployeeComponent,
    NavbarEmployeeComponent,
    FooterEmployeeComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    SidebarEmployeeComponent,
    NavbarEmployeeComponent,
    FooterEmployeeComponent
  ]
})
export class ComponentsModule { }
