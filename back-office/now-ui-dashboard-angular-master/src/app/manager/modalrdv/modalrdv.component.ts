import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modalrdv',
  templateUrl: './modalrdv.component.html',
  styleUrls: ['./modalrdv.component.css']
})
export class ModalrdvComponent {
  @Input() selectedMonth: string;
  @Input() dailyAmounts: any[];
  
  constructor(public modal: NgbActiveModal) {}
}
