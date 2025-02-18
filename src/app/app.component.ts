import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlarmComponent } from './modules/alarm/alarm.component';
import { MenuComponent } from './modules/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FormDataService } from './services/form-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AlarmComponent,MenuComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'boxingalarm';

  constructor(private dataService:FormDataService){}

  get formsent() {
    return this.dataService.formsent();
  }
}
