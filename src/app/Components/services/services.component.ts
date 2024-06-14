import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../../Services/config.service';
import { ServicesDataService } from '../../Services/servicesData.service';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit{

  // @ViewChild("servForm") servForm: NgForm

  companyCode: string = '';
  serviceName: string;
  objectName: string;
  configData  //database data
  companyNames;
  companyName
  uniqueService
  serviceKeys
  serviceslist = [];
  objectList
  servicesAllData//services data..............
  sidebarVisible: boolean;
  // serviceValues
  countedServices
  uniqueServiceNames
  serviceDisplayedData
  selectedServiceValues
  companyServicesList = []
  servicesObjectList
  serviceObjectList
  uniqueServicessss

  constructor(private configService: ConfigService, private serviceData: ServicesDataService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit(){
    this.fetchConfigDetails();
    this.gettingListOfData()
    // this.DisplayCounts()
  }

  fetchConfigDetails() {

    this.configService.fetchConfigDetails().subscribe({
      next: (data) => {
        this.configData = data;
        // console.log(this.configData);
        let company = Object.values(this.configData.filter(conf => conf.id == 'companyNames')[0])
        company.pop();
        // console.log(company);
        this.companyNames = [...company];
        // console.log(this.companyNames);
        
      }
    })
  }

  visible: boolean;

    position: string;

    showDialog(position: string) {
        this.position = position;
        this.visible = true;
    }

    deleteUser(id: string){
      // console.log(id);
    // this.userDataService.deleteProduct(id);
    }

    reset(servForm){
      servForm.reset();
    }

    search(companyName){

      this.serviceData.getAllServices().subscribe(
        {next: (data) => {
          this.servicesAllData = data;
          console.log(this.servicesAllData);
          
          this.serviceKeys = Object.keys(this.servicesAllData)
          console.log(this.serviceKeys);

    
          
          // console.log(this.companyNames); 

      // this.DisplayCounts()
      this.filterServicesByCompany(this.companyName)
      
      },
      error: (error) => {
        console.log(error);
        }}
        )
        }
        
        displayServiceDailog: boolean;
        
        showServiceDialog(serviceName: string) {
          this.displayServiceDailog = true;
          this.filterObjectsByServices(serviceName)
    }
    

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  // Assume this is within your component class

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
  
  gettingListOfData(){
    const dataList = this.serviceKeys.map(str => {
      const trimmedStr = str.substring(1, str.length - 1); // Remove surrounding brackets
      return trimmedStr.split(', ').map(part => part.trim()); // Split by ', ' and trim spaces
    });
    
    // Extract the first value from each list
    this.companyNames = dataList.map(list => list[0]);
    this.serviceslist = dataList.map(list => list[1]);
    this.objectList = dataList.map(list => list[2]);
  }
  DisplayCounts() {
    this.countedServices = this.countLengthOfServices();
    // this.uniqueServiceNames = Object.keys(this.countedServices);
  }

  serviceObjectClicked(obj: string) {
    const keyMatches = this.serviceKeys.find(key => key.includes(obj));
    if (keyMatches) {
      this.selectedServiceValues = this.servicesAllData[keyMatches];
      console.log(this.selectedServiceValues);
    }
  }
  
  clearObject() {
    this.selectedServiceValues = ''; // Clear selected service values
  }
  


onSubmit(servForm) {

  if(this.companyName != '' && this.companyName != undefined && this.companyName != null){
  this.search(this.companyName)
  }

}

filterServicesByCompany(companyName: string): void {
  // Convert company name to lowercase for case-insensitive comparison
  const targetCompany = companyName.trim().toLowerCase();

  // Filter indices where company name matches
  const matchingIndices = this.companyNames
    .map((company, index) => ({ company, index })) // Map to { company, index }
    .filter(item => item.company.toLowerCase() === targetCompany) // Filter by company name
    .map(item => item.index); // Extract indices

  // Display all services of the matched company
  this.companyServicesList = matchingIndices.map(index => this.serviceslist[index]);

  let mySet: Set<number> = new Set(this.companyServicesList);

this.uniqueServicessss = [...mySet.keys()];

// this.servicesObjectList = this.uniqueServicessss.map(key => key.)

this.DisplayCounts()
  
}

filterObjectsByServices(service: string): void {
  // Convert company names to lowercase for case-insensitive comparison
  const targetServices = service.trim().toLowerCase();

  // Filter indices where company names match
  const matchingIndices = this.uniqueServicessss
    .map((service, index) => ({ service, index })) // Map to { service, index }
    .filter(item => targetServices.includes(item.service.toLowerCase())) 
    .map(item => item.index); // Extract indices

  // Display all services of the matched companies
  this.serviceObjectList = matchingIndices.map(index => this.objectList[index]);
}
}
    




          
          
          // for (let key of this.serviceKeys) {
          //   const extractedKey = key.match(/\[(.*?)\,/)?.[1]; // Extract the key part between square brackets and comma
          
          //   if (companyName === this.companyNames) {
          //     const servicesValues = this.serviceKeys.map(key => key.split(', ')[1]); // Create an array of service values
          //     this.serviceslist = servicesValues;
          //   }
          // }

          // this.serviceValues = Object.values(this.servicesAllData)

        //   const servicesValues = this.serviceKeys.map(key => {
        //     const keyArray = key.split(', '); // Split the key into an array
        //     return keyArray[1]
        // });
        // this.serviceslist = servicesValues;
        // console.log(this.serviceslist);

      //   const objectValues = this.serviceKeys.map(key => {
      //     const keyArray = key.split(', '); // Split the key into an array
      //    return keyArray[2];
      // });
      // this.objectList = objectValues