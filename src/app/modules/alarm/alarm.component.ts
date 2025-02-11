import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-alarm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alarm.component.html',
  styleUrl: './alarm.component.scss'
})
export class AlarmComponent {

  seconds:number = 5;
  tenseconds:number = 5;
  realseconds:number = 55;
  minutes:number = 0;
  tenminutes:number = 0;
  isFirstNine:boolean=true;
  isFirstNineMinutes:boolean=true;
  

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.runTimer()
  }


  runTimer(){

    setInterval(() => {
      this.seconds +=1;
      this.realseconds+=1;

      if(this.seconds>=10){
        this.seconds = 0;
        this.tenseconds += 1;
      }

      if(this.realseconds>59){
        this.seconds = 0;
        this.tenseconds = 0;
        this.realseconds = 0;
        this.minutes +=1;
      }
    }, 1000);

  }


}
