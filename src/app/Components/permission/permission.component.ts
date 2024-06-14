import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../Services/user-data.service';
import { UserDetails } from '../../Model/UserDetails';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';


@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.css'
})
export class PermissionComponent implements OnInit{
  checked: boolean= false;
  // userData;
  userData: UserDetails[]=[];
  errorMessage;
  deleteParticularUser;
  isManagable:boolean;
  manageData
  first = 1;
  rows = 10;
  totalRecords;
  last;
  isNull

  constructor(private userDataService: UserDataService, private confirmationService: ConfirmationService, private messageService: MessageService){ }

  ngOnInit(){
    this.fetchUserDetails();
    // this.checkmanagable()
    if(this.userData == null){
      this.isNull = true;
    }
  }

    fetchUserDetails(){
      this.userDataService.fetchUserDetails().subscribe({ 
        next: (data) =>{
        this.userData = data;
        // console.log(this.userData);

        this.manageData = this.userData.map(item => item.permission)
        console.log(this.manageData);

        this.totalRecords = this.userData.length;
        this.last = Math.min(this.first + this.rows, this.totalRecords);
        // console.log(this.last);
      }
      ,error: (err)=>{
        this.errorMessage = err.message;
        console.log("error"+this.errorMessage);
      }
    }
    )
    }

    save(id,userType){
      // this.isManagable = true;
      this.userDataService.updateData(id, userType)
    }


    deleteButton(position:string, id: string){
      this.confirmPosition(position);
      this.deleteParticularUser = id;
    }

    position: string;
    confirmPosition(position: string) {
        this.position = position;

        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            icon: 'pi pi-question',
            accept: () => {
              this.deleteUser(this.deleteParticularUser);
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
            },
            reject: (type) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
                        break;
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
                        break;
                }
            },
            key: 'positionDialog'
        });
    }
    deleteUser(id: string){
      // console.log(id);
    this.userDataService.deleteData(id);
    }

    searchBar(){
      this.checked = !this.checked
    }

    updatePermission(user: any) {
      user.permission = user.permission ? 'manage' : 'view';
    }

    // toggleSwitch(){
      // this.isManagable = !this.isManagable
    // }



    // checkmanagable(){
    //   for(let manage of this.manageData){
    //     if(manage == 'view'){
    //         this.isManagable = false;
    //     }else{
    //       this.isManagable = true;
    //     }
    //   }
    // }
}
