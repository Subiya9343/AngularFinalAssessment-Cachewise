import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../../Services/config.service';
import { ServicesDataService } from '../../Services/servicesData.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {

  @ViewChild("servForm") servForm: NgForm

  serviceName: string = '';
  objectName: string = '';
  configData  //database data
  companyNames;
  services
  servName
  companyName: string = '';
  serviceKeys
  serviceslist: any[] = [];
  objectList
  servicesAllData//services data..............
  sidebarVisible: boolean = true;
  countedServices
  companyServicesList: any[] = []
  serviceObjectList
  uniqueServices
  allCompanyNames: any[]
  position: string;
  clearServiceDialogVisible: boolean;
  serviceBoxes: boolean
  displayServiceDailog: boolean;
  dataNotFound: boolean = false;
  filteredCompanies: any[]
  filteredServices: any[]
  isLoading: boolean = false;
  indexToDelete: number;
  //  inside dialogbox
  selectedService
  selectedObject
  clearObjectDialogVisible: boolean = false
  selectedObjectValue: string

  constructor(private configService: ConfigService, private serviceData: ServicesDataService,
    private messageService: MessageService, private clipboardService: ClipboardService) { }

  ngOnInit() {
    this.fetchConfigDetails();
  }

  // autocomplete filtered companies
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
  // autocomplete filtered services
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

  fetchConfigDetails() {
    this.isLoading = true;
    this.configService.fetchConfigDetails().subscribe({
      next: (data) => {
        this.configData = data;
        let company = Object.values(this.configData.filter(conf => conf.id == 'companyNames')[0])
        company.pop();
        this.companyNames = [...company];

        const serData = this.configData.find(conf => conf.id === 'services');
        if (serData) {
          let ser: { name: string, url: string }[] = Object.values(serData);
          ser.pop();
          console.log(ser);
          this.services = [...ser];
          const serviceOption = this.services.map(item => ({
            label: item.name,
            value: item.name
          }));
        }
        this.servName = this.services.map(item => item.name);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  search(companyName, serviceName, objectName, mapName) {
    this.isLoading = true;
    this.serviceBoxes = true
    this.serviceData.getAllServices(companyName, serviceName, objectName, mapName).subscribe(
      {
        next: (data) => {
          this.dataNotFound = false
          this.servicesAllData = data;
          console.log(this.servicesAllData);

          this.serviceKeys = Object.keys(this.servicesAllData)
          console.log(this.serviceKeys);

          this.DisplayCounts()
          this.gettingListOfData()
          this.filterServicesByCompany(this.companyName, this.servName)

        },
        error: (error) => {
          console.log(error);
          this.dataNotFound = true
          this.serviceBoxes = false
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      }
    )
  }

  showServiceDialog(serviceName: string) {
    this.displayServiceDailog = true;
    this.selectedService = serviceName;
    this.filterObjectsByServices(serviceName)
    const keyMatches = this.serviceKeys.find(key => key.includes(this.serviceObjectList[0]));

    this.selectedObjectValue = this.servicesAllData[keyMatches]
    this.selectedObject = this.serviceObjectList[0]
  }


  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  countLengthOfServices(): { [name: string]: number } {
    let servCount: { [name: string]: number } = {};

    for (let name of this.companyServicesList) {
      if (servCount[name]) {
        servCount[name]++;
      } else {
        servCount[name] = 1;
      }
    }
    return servCount;
  }

  gettingListOfData() {
    const dataList = this.serviceKeys.map(str => {
      const trimmedStr = str.substring(1, str.length - 1);
      return trimmedStr.split(', ').map(part => part.trim());
    });

    this.allCompanyNames = dataList.map(list => list[0]);
    this.serviceslist = dataList.map(list => list[1]);
    this.objectList = dataList.map(list => list[2]);
  }
  DisplayCounts() {
    this.countedServices = this.countLengthOfServices();
  }

  serviceObjectClicked(obj: string, index: number) {
    this.selectedObject = obj
    const keyMatches = this.serviceKeys.find(key => key.includes(obj));
    if (keyMatches) {
      this.selectedObjectValue = this.servicesAllData[keyMatches];
      console.log(this.selectedObjectValue);
    }
  }
  copyJson(selectedObjectValue) {
    const jsonString = JSON.stringify(selectedObjectValue, null, 2);
    this.clipboardService.copyFromContent(jsonString)
    alert('JSON copied to clipboard!');
  }

  onSubmit(servForm) {
    if (this.companyName != '' && this.companyName != undefined && this.companyName != null) {
      let mapName = '';
      if (this.serviceName !== '') {
        this.serviceslist.forEach(object => {
          if (object.name === this.serviceName) {
            mapName = object.url;
          }
        });
      }
      this.search(this.companyName, this.serviceName, this.objectName, mapName)
    }
  }

  filterServicesByCompany(companyName: string, service: string): void {

    const targetCompany = companyName.trim().toLowerCase();

    const matchingIndices = this.allCompanyNames
      .map((company, index) => ({ company, index }))
      .filter(item => item.company.toLowerCase() === targetCompany)
      .map(item => item.index);

    this.companyServicesList = matchingIndices.map(index => this.serviceslist[index]);
    console.log(this.companyServicesList);


    let mySet: Set<number> = new Set(this.companyServicesList);

    this.uniqueServices = [...mySet.keys()];
    console.log(this.uniqueServices);

    this.DisplayCounts()
  }

  filterObjectsByServices(service: string): void {
    const targetServices = service.trim().toLowerCase();
    const matchingIndices = this.serviceslist
      .map((service, index) => ({ service, index }))
      .filter(item => targetServices.includes(item.service.toLowerCase()))
      .map(item => item.index);
    // Display all services of the matched companies
    this.serviceObjectList = matchingIndices.map(index => this.objectList[index]);
    console.log(this.serviceObjectList);
  }
  showServiceClearDialog(position: string, index: number) {
    this.position = position
    this.clearServiceDialogVisible = true;
    this.indexToDelete = index;
  }

  serviceDelete() {
    if (this.indexToDelete !== null && this.indexToDelete !== undefined) {
      this.uniqueServices.splice(this.indexToDelete, 1);
      this.clearServiceDialogVisible = false;
      this.indexToDelete = null;
      this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
    }
  }

  showObjectClearDialog(position: string) {
    this.position = position
    this.clearObjectDialogVisible = true;
  }
  clearNo() {
    this.clearServiceDialogVisible = false;
    this.clearObjectDialogVisible = false
  }
  resetService() {
    this.serviceBoxes = false
    this.dataNotFound = false
  }
}