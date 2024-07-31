import { Component, Input, OnInit, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-order-proceed-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './order-proceed-dialog.component.html',
  styleUrl: './order-proceed-dialog.component.css'
})
export class OrderProceedDialogComponent implements OnInit {
  ngOnInit(): void {
    this.showOrderToProceedDialog = this.showOrderToProceedPopup;
  }
  showOrderToProceedDialog: boolean = false;
  @Input() orderToProceed!: any;
  @Input() showOrderToProceedPopup: any =  false;

  
  showDialog() {
      this.showOrderToProceedDialog = this.showOrderToProceedPopup;
  }
}
