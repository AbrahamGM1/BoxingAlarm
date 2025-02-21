import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {

  constructor() { }

  private formData = new BehaviorSubject<any>(this.loadFormData());
  formData$ = this.formData.asObservable();
  formsent = signal(this.loadFormSent())

  setFormData(data: any) {
    this.formData.next(data);
    this.formsent.set(true);

    //Para que persistan los datos
    sessionStorage.setItem('formData',JSON.stringify(data));
    sessionStorage.setItem('formsent','true');
  }

  private loadFormData(){
    const savedData = sessionStorage.getItem('formData');
    return savedData ? JSON.parse(savedData) : null;
  }

  private loadFormSent(): boolean {
    //Si no encontró el dato, regresa un falso
    return sessionStorage.getItem('formsent') === 'true';
  }

}
