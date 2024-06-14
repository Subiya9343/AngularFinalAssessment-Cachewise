import { Component } from '@angular/core';
import { ConfigService } from '../../Services/config.service';
import { ServicesDataService } from '../../Services/servicesData.service';

@Component({
  selector: 'app-cleanup',
  templateUrl: './cleanup.component.html',
  styleUrl: './cleanup.component.css'
})
export class CleanupComponent {

  serviceName: string;
  objectName: string;
  companyNames;
  companyName
  servicesAllData
  serviceKeys
  serviceslist
  objectList

  constructor(private serviceData: ServicesDataService){ }

  ngOnInit(){
    this.fetchServiceDetails();
  }

  // environmentOptions = [
  //   { label: 'Option 1', value: '1' },
  //   { label: 'Option 2', value: '2' },
  //   { label: 'Option 3', value: '3' }
  // ];

  onSubmit(serviceForm){
    serviceForm.reset()
  }

  fetchServiceDetails(){
  this.serviceData.getAllServices().subscribe(
    {next: (data) => {
      this.servicesAllData = data;
      console.log(this.servicesAllData);
      
      this.serviceKeys = Object.keys(this.servicesAllData)
      // console.log(this.serviceKeys);

      const dataList = this.serviceKeys.map(str => {
        const trimmedStr = str.substring(1, str.length - 1); // Remove surrounding brackets
        return trimmedStr.split(', ').map(part => part.trim()); // Split by ', ' and trim spaces
      });
      
      // Extract the first value from each list
      this.companyNames = dataList.map(list => list[0]);
      this.serviceslist = dataList.map(list => list[1]);
      this.objectList = dataList.map(list => list[2]);
    },
    error: (error) => {
      console.log(error);
      }}
      )
    }

  // fetchConfigDetails() {

  //   this.configService.fetchConfigDetails().subscribe({
  //     next: (data) => {
  //       this.configData = data;
  //       // console.log(this.configData);
  //       let company = Object.values(this.configData.filter(conf => conf.id == 'companyNames')[0])
  //       company.pop();
  //       // console.log(company);
  //       this.companyNames = [...company];
  //       // console.log(this.companyNames);
        
  //     }
  //   })
  // }
}
