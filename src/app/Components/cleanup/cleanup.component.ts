import { Component, ViewChild } from '@angular/core';
import { ConfigService } from '../../Services/config.service';
import { ServicesDataService } from '../../Services/servicesData.service';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cleanup',
  templateUrl: './cleanup.component.html',
  styleUrl: './cleanup.component.css'
})
export class CleanupComponent {

  serviceName: string;
  objectName: string;
  companyNames;
  companyName: string = null;
  dataNotFound: boolean = false;
  servicesAllData
  serviceKeys
  serviceslist
  objectList
  configData
  companyServiceNames
  services
  environment
  servName
  serviceOption
  isLoading: boolean = false;
  filteredCompanies: any[]
  filteredServices: any[]

  constructor(private serviceData: ServicesDataService,private configService: ConfigService, private confirmationService: ConfirmationService, private messageService: MessageService){ }

  cleanForm: NgForm
  ngOnInit(){
    this.fetchConfigDetails();
    this.fetchServiceDetails(this.companyName, this.serviceName, this.objectName)
  }

  filterCompany(event) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.companyNames.length; i++) {
        let company = this.companyNames[i];
        if (company.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(company);
        }
    }

    this.filteredCompanies = filtered;
  }

  filterServices(event) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.servName.length; i++) {
        let service = this.servName[i];
        if (service.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(service);
        }
    }

    this.filteredServices = filtered;
  }

  fetchServiceDetails(companyName, serviceName, objectName){
    let mapName = '';
    if (serviceName && this.serviceslist) {
      this.serviceslist.forEach(object => {
        if (object.name === serviceName) {
          mapName = object.url;
        }
      });
    }
  this.serviceData.getAllServices(companyName, serviceName, objectName, mapName).subscribe(
    {next: (data) => {
      this.servicesAllData = data;
      console.log(this.servicesAllData);
      
      this.serviceKeys = Object.keys(this.servicesAllData)
      // console.log(this.serviceKeys);

      const dataList = this.serviceKeys.map(str => {
        const trimmedStr = str.substring(1, str.length - 1); 
        return trimmedStr.split(', ').map(part => part.trim());
      });
      
      this.companyServiceNames = dataList.map(list => list[0]);
      this.serviceslist = dataList.map(list => list[1]);
      this.objectList = dataList.map(list => list[2]);
    }
    }
      )
    }

    visible: boolean;

    position: string;

    showDialog(position: string) {
        this.position = position;
        this.visible = true;
    }
  
    noButton(){
      this.visible= false;
    }
    yesButton(servicesAllData){
      this.visible= false;
      this.clearData(this.companyName, this.serviceName, this.objectName)
    }
    
    clearData(companyName: string, serviceName: string, objectName: string){
      let mapName = '';
      if (serviceName && this.serviceslist) {
        this.serviceslist.forEach(object => {
          if (object.name === serviceName) {
            mapName = object.url;
          }
        });
      }
      this.serviceData.clearData(companyName, serviceName, objectName, mapName).subscribe(
        {
          next: (data) => {
          console.log(data + "Data Cleared");
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
        },
        error: (error) => {
          console.log(error);
          this.dataNotFound = true;
          }}
      )
    }
    fetchConfigDetails() {
      this.isLoading = true;
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
          this.serviceOption = this.services.map(item => ({
            label: item.name,
            value: item.name
          }));
        }
        this.servName = this.services.map(item => item.name);
      },
      error:(error)=>{
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }
  resetButtonClicked(){
    this.cleanForm.reset()
    // this.dataNotFound = false;
  }
  onSubmit(cleanForm:NgForm){
    if(cleanForm.valid){
      this.showDialog('top');
    }
  }
}
