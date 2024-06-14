import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConfigData, ConfigService } from '../../Services/config.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent {
  newCompanyName: string = ''; // Input field ngModel data
  companyNames: any[] = []; // Array to store company names
  tempCompany:any[]= [];
  tempEnvironment: { name: string; url: string }[] = [];
  tempServices: { name: string; url: string }[] = [];
  configData;//Database
  errorMessage;
  environment: { name: string, url: string }[] = [];
  services: { name: string, url: string }[] = [];
  isEmptyEnvironment: boolean;//---------------------------pending
  isEditMode: boolean = false;
  totalRecords
  first = 0;
  rows;
  ID = '';
  isEnvNull
  isServNull


  constructor(private configService: ConfigService) { }

  ngOnInit() {

    this.fetchConfigDetails();
    // this.fetchCompanyDetails();
    if(this.environment == null){
      this.isEnvNull = true;
    }
    if(this.services == null){
      this.isServNull = true;
    }

  }

  addCompanyName() {
    if (this.newCompanyName.trim() !== '') {
      this.tempCompany.push(this.newCompanyName.trim());
      this.newCompanyName = ''; // Clear the input field
    }
  }

  addEnvironment() {
    const lastTempEnv = this.tempEnvironment[this.tempEnvironment.length - 1];
    if (lastTempEnv && lastTempEnv.name.trim() !== '' && lastTempEnv.url.trim() !== '') {
      this.tempEnvironment.push({ name: '', url: '' });
    } else if (this.tempEnvironment.length === 0) {
      this.tempEnvironment.push({ name: '', url: '' });
    }


    // console.log(this.environment);
  }

  // Method to add a service to the map
  addService() {
    // Implement your logic to add a service
    const lastTempSer = this.tempServices[this.tempServices.length - 1];
    if (lastTempSer && lastTempSer.name.trim() !== '' && lastTempSer.url.trim() !== '') {
      this.tempServices.push({ name: '', url: '' });
    } else if (this.tempServices.length === 0) {
      this.tempServices.push({ name: '', url: '' });
    }
  }

  // Method to save data to the database
  saveDataToDatabase() {
    const data: ConfigData = {
      companyNames: this.companyNames,
      environment: this.environment,
      services: this.services
    };
    console.log(data);
    this.configService.sendData(data);
  }

  fetchConfigDetails() {

    this.configService.fetchConfigDetails().subscribe({
      next: (data) => {
        this.configData = data;
        console.log(this.configData);

        let company = Object.values(this.configData.filter(conf => conf.id == 'companyNames')[0])
        company.pop();
        // console.log(company);
        this.companyNames = [...company];

        const envData = this.configData.find(conf => conf.id === 'environment');
        if (envData) {
          let env: { name: string, url: string }[] = Object.values(envData);
          env.pop();
          // console.log(env);
          this.environment = [...env];
        }

        const serData = this.configData.find(conf => conf.id === 'services');
        if (serData) {
          let ser: { name: string, url: string }[] = Object.values(serData);
          ser.pop();
          console.log(ser);
          this.services = [...ser];
        }

        this.totalRecords = this.companyNames.length;
      },
      error: (err) => {
        this.errorMessage = err.message;
        console.log("error: " + this.errorMessage);
      }
    });
  }
  edit(){
    this.isEditMode = true;

  }


  save() {
    for(let temp of this.tempCompany){
      this.companyNames.push(temp);
    }

    this.environment.push(...this.tempEnvironment);

    this.environment.push(...this.tempServices)


    if (this.configService.url == '') {
      this.saveDataToDatabase();
    } else {
      const data: ConfigData = {
        companyNames: this.companyNames,
        environment: this.environment,
        services: this.services
      };
      console.log(data);
      this.configService.updateData(this.ID, data);
    }
    this.isEditMode = false;
  }

  paginate(event) {
    this.first = event.first;
    this.rows = event.rows;
  }

  cancel(){
    this.isEditMode = false;
    this.tempEnvironment = []
    this.tempServices = []

  }

  deleteCompanyName(index){
    if (index > -1 && index < this.companyNames.length) {
      this.companyNames.splice(index, 1);
    }
  }
}
