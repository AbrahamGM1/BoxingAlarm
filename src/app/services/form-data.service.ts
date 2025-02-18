import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {

  constructor() { }

  private formData = new BehaviorSubject<any>(null); // BehaviorSubject almacena los datos actuales
  formData$ = this.formData.asObservable(); // Observable para suscribirse en otros componentes
  formsent = signal(false)

  setFormData(data: any) {
    this.formData.next(data); // Actualiza los datos
    this.formsent.set(true);
  }

}
