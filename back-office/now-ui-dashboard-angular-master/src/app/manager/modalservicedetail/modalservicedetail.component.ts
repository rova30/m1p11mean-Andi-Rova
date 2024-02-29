// modalservicedetail.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from '../../api/service.service';

@Component({
  selector: 'app-modalservicedetail',
  templateUrl: './modalservicedetail.component.html',
  styleUrls: ['./modalservicedetail.component.css']
})
export class Modalservicedetail {
  @Input() service: any;
  @Output() serviceUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public activeModal: NgbActiveModal, private serviceService: ServiceService) {}

  save(): void {
    const updatedServiceData = {
      name: this.service.name,
      deadline: this.service.deadline,
      cost: this.service.cost,
      commission: this.service.commission
    };

    // Appel de la méthode updateService du service pour mettre à jour le service
    this.serviceService.updateService(this.service._id, updatedServiceData)
      .subscribe(response => {
        // Gérer la réponse de la mise à jour, par exemple, afficher un message de succès
        console.log('Service mis à jour avec succès :', response);
        // Émettre un événement pour indiquer que la mise à jour du service est terminée
        this.serviceUpdated.emit(true);
        // Fermer le modal une fois la mise à jour terminée
        this.activeModal.close('Save click');
      }, error => {
        // En cas d'erreur, afficher un message d'erreur
        console.error('Erreur lors de la mise à jour du service :', error);
      });
  }
}
