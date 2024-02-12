import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { EmployeeLayoutComponent } from './layouts/employee-layout/employee-layout.component';
import { PageNotFoundComponent } from './error/404/page-not-found.component';
import { LoginManagerComponent } from './manager/login/login.component';
import { LoginEmployeeComponent } from './employee/login/login.component';
import { EmployeeService } from './api/employee.service';
import { ManagerService } from './api/manager.service';
import { CustomerService } from './api/customer.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgbModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    EmployeeLayoutComponent,
    PageNotFoundComponent,
    LoginManagerComponent,
    LoginEmployeeComponent
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
