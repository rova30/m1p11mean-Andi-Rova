import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modalca',
  templateUrl: './modalca.component.html',
  styleUrls: ['./modalca.component.css']
})
export class ModalcaComponent {
  @Input() selectedMonth: string;
  @Input() dailyAmounts: any[];
  
  constructor(public modal: NgbActiveModal) {}
}
