import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { EmployeeLayoutComponent } from './layouts/employee-layout/employee-layout.component';
import { PageNotFoundComponent } from './error/404/page-not-found.component';

const routes: Routes =[
  {
    path: 'manager',
    redirectTo: 'page-not-found',
    pathMatch: 'full',
  }, {
    path: '',
    component: AdminLayoutComponent,
    children: [
        {
      path: '',
      loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(x=>x.AdminLayoutModule)
  }]},
  {
    path: 'employee',
    redirectTo: 'page-not-found',
    pathMatch: 'full',
  }, {
    path: '',
    component: EmployeeLayoutComponent,
    children: [
        {
      path: '',
      loadChildren: () => import('./layouts/employee-layout/employee-layout.module').then(x=>x.EmployeeLayoutModule)
  }]},
  {
    path: '**',
    component: PageNotFoundComponent,
  }
];


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
