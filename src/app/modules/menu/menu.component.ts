import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FormDataService } from '../../services/form-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private dataService: FormDataService){
    this.form = fb.group({
      rounds: [[Validators.required, Validators.min(1), Validators.max(99)]],
      minutes: [[Validators.required, Validators.min(1), Validators.max(59)]],
      seconds: [[Validators.required, Validators.min(1), Validators.max(59)]],
      restminutes: [[Validators.required, Validators.min(1), Validators.max(59)]],
      restseconds:  [[Validators.required, Validators.min(1), Validators.max(59)]]
    })
  }

  sendForm(){
    if(this.form.valid){
      this.dataService.setFormData(this.form.value);
      this.dataService.formsent.set(true);
      console.log(this.form.value)
    }
  }

}
