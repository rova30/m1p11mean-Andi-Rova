import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-employee',
  templateUrl: './footer-employee.component.html',
  styleUrls: ['./footer-employee.component.css']
})
export class FooterEmployeeComponent implements OnInit {
  data : Date = new Date();
  
  constructor() { }

  ngOnInit() {
  }
  ngOnDestroy():void {
  }


}
