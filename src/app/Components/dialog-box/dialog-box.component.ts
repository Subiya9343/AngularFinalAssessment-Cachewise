import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../../Services/config.service';
import { HttpClient } from '@angular/common/http';

interface SelectItem {
  label: string;
  value: string;
}

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})
export class DialogBoxComponent implements OnInit {

  cardForm: FormGroup;
  environmentOptions: SelectItem[] = [];
  configData: any;
  errorMessage: string = '';
  envName: string[] = [];
  environmentDropdown: { name: string, url: string }[] = [];
  showDialog: boolean = true;

  constructor(private router: Router, private configService: ConfigService, private http: HttpClient) { }

  ngOnInit(): void {
    this.cardForm = new FormGroup({
      environment: new FormControl('', Validators.required),
      token: new FormControl('')
    });

    this.fetchConfigDetails();
  }

  onSubmit(): void {
    console.log(this.cardForm.value);
    const data = {
      environment: this.cardForm.value.environment, 
      token: this.cardForm.value.token
    };
    this.addEnvironmentDetails(data);
    this.router.navigate(['/Services']);
  }

  cancel(): void {
    this.cardForm.reset();
    this.showDialog = false;
  }

  fetchConfigDetails(): void {
    this.configService.fetchConfigDetails().subscribe({
      next: (data) => {
        this.configData = data;
        console.log(this.configData);

        const envData = this.configData.find((conf: any) => conf.id === 'environment');
        if (envData) {
          const env: { name: string, url: string }[] = Object.values(envData);
          env.pop(); // Remove the last item if it's not an environment configuration
          this.environmentDropdown = [...env];

          this.environmentOptions = this.environmentDropdown.map(item => ({
            label: item.name,
            value: item.name
          }));
        }
        this.envName = this.environmentDropdown.map(item => item.name);
      },
      error: (err) => {
        this.errorMessage = err.message;
        console.log("error: " + this.errorMessage);
      }
    });
  }

  addEnvironmentDetails(env: { environment: string, token: string }): void {
    this.http.post('https://angular-final-assessment-default-rtdb.firebaseio.com/environment-data.json', env)
      .subscribe((res) => {
        console.log(res);
      });
  }
}
