import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dashboard-box',
  imports: [],
  templateUrl: './dashboard-box.component.html',
  styleUrl: './dashboard-box.component.css'
})
export class DashboardBoxComponent {
  @Output() open = new EventEmitter();

  onStartTestClick() {
    this.open.emit();
  }
}
