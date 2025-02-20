import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FormDataService } from '../../services/form-data.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder, private dataService: FormDataService, private router:Router){
    this.form = fb.group({
      rounds: [9,[Validators.required, Validators.min(1), Validators.max(99), Validators.pattern('^[^\.]+$')]],
      minutes: [3,[Validators.required, Validators.min(1), Validators.max(59), Validators.pattern('^[^\.]+$')]],
      seconds: [10,[Validators.required, Validators.min(0), Validators.max(59), Validators.pattern('^[^\.]+$')]],
      restminutes: [1,[Validators.required, Validators.min(1), Validators.max(59), Validators.pattern('^[^\.]+$')]],
      restseconds:  [10,[Validators.required, Validators.min(0), Validators.max(59), Validators.pattern('^[^\.]+$')]]
    })
  }

  sendForm(){
    if(this.form.valid){
      this.dataService.setFormData(this.form.value);
      this.dataService.formsent.set(true);
      this.router.navigate(['/alarm']);
    }
  }

}
