import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../../Services/config.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../Services/auth.service';
import { ServicesDataService } from '../../Services/servicesData.service';

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
  envValue: string[] = []
  environmentDropdown: { name: string, url: string }[] = [];
  showDialog: boolean = true;
  isAdminLogged
  serviceUrl
  environmentURL
  serviceToken
  filteredEnvironment: any[]
  checkUserOrAdmin:string
  displayCancelButton: boolean

  constructor(private router: Router, private configService: ConfigService, private http: HttpClient, private authService: AuthService, private serviceData: ServicesDataService) { }
  
  ngOnInit(): void {
    this.cardForm = new FormGroup({
      environment: new FormControl('', Validators.required),
      servToken: new FormControl('', [Validators.required, this.notOnlyWhitespace()])
    });

    this.fetchConfigDetails();
    this.checkUserorAdmin();
    
  }

  onSubmit(): void {
    console.log(this.cardForm.value);
    const data = {
      environment: this.cardForm.value.environment, 
      servToken: this.cardForm.value.servToken
    };
    localStorage.setItem('environment', data.environment);
    localStorage.setItem('serviceToken', data.servToken);

    
    this.serviceData.setHttpHeaders();

    if(localStorage.getItem('isAdminLogged') === 'true'){
      localStorage.setItem('isAdminLogged', 'true')
    }
    this.authService.isUserLogged = true
    this.router.navigate(['/Services']);
  }

  checkUserorAdmin(){
    this.checkUserOrAdmin = localStorage.getItem('loggedInUserPermission')
    if(this.checkUserOrAdmin === 'true'){
      this.displayCancelButton = true
    }
  }

  cancel(): void {
    this.cardForm.reset();
    this.showDialog = false;
    this.router.navigate(['/Permission'])
  }

  fetchConfigDetails(): void {
    this.configService.fetchConfigDetails().subscribe({
      next: (data) => {
        this.configData = data;
        console.log(this.configData);

        const envData = this.configData.find((conf: any) => conf.id === 'environment');
        if (envData) {
          const env: { name: string, url: string }[] = Object.values(envData);
          env.pop(); 
          this.environmentDropdown = [...env];

          this.environmentOptions = this.environmentDropdown.map(item => ({
            label: item.name,
            value: item.url
          }));
        }
        this.envName = this.environmentDropdown.map(item => item.name);
        this.envValue = this.environmentDropdown.map(item => item.url);
      },
      error: (err) => {
        this.errorMessage = err.message;
        console.log("error: " + this.errorMessage);
      }
    });
  }
  filterEnvironment(event) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.envName.length; i++) {
        let environment = this.envName[i];
        if (environment.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(environment);
        }
    }

    this.filteredEnvironment = filtered;
  }

    // Custom validator function to check for whitespace
  notOnlyWhitespace(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value && control.value.trim().length === 0) {
      return { 'notOnlyWhitespace': true }; 
    }
    return null; 
  };
}

}
