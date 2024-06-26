import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConfigData, ConfigService } from '../../Services/config.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent {
  newCompanyName: string = '';
  companyNames: any[] = [];
  tempCompany: any[] = [];
  tempEnvironment: { name: string; url: string }[] = [];
  tempServices: { name: string; url: string }[] = [];
  configData;//Database
  errorMessage;
  environment: { name: string, url: string }[] = [];
  services: { name: string, url: string }[] = [];
  isEditMode: boolean = false;
  totalRecords
  first = 0;
  rows;
  ID = '';
  showEnvPaginator: boolean
  showSerPaginator: boolean
  databaseEnvironment
  isLoading: boolean = false;


  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.fetchConfigDetails();
  }

  addCompanyName() {
    if (this.newCompanyName != null && this.newCompanyName != '') {
      this.companyNames.push(this.newCompanyName);
      this.newCompanyName = '';
    }
  }

  addEnvironment() {
    const lastTempEnv = this.environment[this.environment.length - 1];
    debugger;
    if (lastTempEnv && lastTempEnv.name.trim() !== '' && lastTempEnv.url.trim() !== '') {
      this.environment.push({ name: '', url: '' });
    } else if (this.environment.length === 0) {
      this.environment.push({ name: '', url: '' });
    }
  }

  addService() {
    const lastTempSer = this.services[this.services.length - 1];
    if (lastTempSer && lastTempSer.name.trim() !== '' && lastTempSer.url.trim() !== '') {
      this.services.push({ name: '', url: '' });
    } else if (this.services.length === 0) {
      this.services.push({ name: '', url: '' });
    }
  }

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
    this.isLoading = true;
    this.configService.fetchConfigDetails().subscribe({
      next: (data) => {
        this.companyNames = [];
        this.tempCompany = [];
        this.configData = data;
        console.log(this.configData);
        let company = Object.values(this.configData.filter(conf => conf.id == 'companyNames')[0])
        company.pop();
        this.companyNames = company;
        this.tempCompany = [...this.companyNames];

        const envData = this.configData.find(conf => conf.id === 'environment');
        if (envData) {
          let env: { name: string, url: string }[] = Object.values(envData);
          env.pop();
          this.environment = [...env];
          // this.environment = this.tempEnvironment

          if (this.environment.length > 3) {
            this.showEnvPaginator = true
          }
        }
        this.fetchServiceData()


        this.totalRecords = this.companyNames.length;
      },
      error: (err) => {
        this.errorMessage = err.message;
        console.log("error: " + this.errorMessage);
      },
      complete: () => {
        this.isLoading = false; // isLoading to false when completes
      }
    });
  }
  fetchServiceData() {
    const serData = this.configData.find(conf => conf.id === 'services');
    if (serData) {
      let ser: { name: string, url: string }[] = Object.values(serData);
      ser.pop();
      console.log(ser);
      this.services = [...ser];

      if (this.services.length > 3) {
        this.showSerPaginator = true
      }
    }
  }
  edit() {
    this.isEditMode = true;
  }

  save() {
    this.environment.push(...this.tempEnvironment);
    this.services.push(...this.tempServices)

    const filteredEnvironment = this.environment?.filter(x => x.name !== '' && x.name !== null);
    const filteredServices = this.services?.filter(x => x.name !== '' && x.name !== null);

    this.environment = filteredEnvironment
    this.services = filteredServices

    if (this.configService.url == '') {
      this.saveDataToDatabase();
    } else {
      const data: ConfigData = {
        companyNames: this.companyNames,
        environment: this.environment,
        services: this.services
      };
      this.tempCompany = [...this.companyNames];
      this.configService.updateData(this.ID, data);
    }
    this.isEditMode = false;
  }

  paginate(event) {
    this.first = event.first;
    this.rows = event.rows;
  }

  cancel() {
    this.isEditMode = false;
    this.tempEnvironment = [];
    this.tempServices = [];
    this.companyNames = [...this.tempCompany];
  }

  deleteCompanyName(index) {
    if (index > -1 && index < this.companyNames.length) {
      this.companyNames.splice(index, 1);
    }
  }
}
