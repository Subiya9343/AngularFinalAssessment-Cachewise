import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDataService } from '../../Services/user-data.service';
import { UserDetails } from '../../Model/UserDetails';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.css'
})
export class PermissionComponent implements OnInit {
  @ViewChild('dt') table: Table;

  checked: boolean = false;
  tempUserDetails: UserDetails[] = [];
  userDetails: UserDetails[] = [];
  userNameSortAsc: boolean = false;
  emailSortAsc: boolean = false;
  errorMessage: string
  deleteParticularUser;
  first: number = 1;
  rows: number = 5;
  totalRecords: number = 0;
  last: number = 0;
  deleteDialogVisible: boolean
  position: string;
  isLoading: boolean = false;
  goToNumber: number

  rowsPerPageOptions = [5, 10, 20, 30];
  showRowsPerPageOptions = false;
  rowsPerPageSelected = 5;

  constructor(private userDataService: UserDataService, private messageService: MessageService) { }

  ngOnInit() {
    this.fetchUserDetails();
    let row = this.table && this.table.rows ? this.table.rows : 5;
    this.totalRecords = Math.ceil(this.userDetails.length / row);
  }

  fetchUserDetails() {
    this.isLoading = true;
    this.userDataService.fetchUserDetails().subscribe({
      next: (data) => {
        this.userDetails = data;
        this.tempUserDetails = data;
        this.totalRecords = this.userDetails.length;
        this.tempUserDetails = this.userDetails.slice(this.first, this.rowsPerPageSelected + 1);
      }
      , error: (err) => {
        this.errorMessage = err.message;
        console.log("error" + this.errorMessage);
      },
      complete: () => {
        this.isLoading = false;
      }
    }
    )
  }
  toggleRowsPerPageOptions() {
    this.showRowsPerPageOptions = !this.showRowsPerPageOptions;
  }

  onRowsPerPageChange(newRowsPerPage: number) {
    this.rowsPerPageSelected = newRowsPerPage
    this.rows = this.rowsPerPageSelected;
    this.tempUserDetails = this.userDetails.slice(this.first, this.rows + 1);
    if (this.rows < this.totalRecords) {
      this.last = this.rows
    } else {
      this.last = this.totalRecords
    }
  }

  sortUserName() {
    if (!this.userNameSortAsc) {
      this.userNameSortAsc = !this.userNameSortAsc;
      this.tempUserDetails.sort((a: UserDetails, b: UserDetails) => {
        if (a?.name?.toLocaleLowerCase() < b?.name?.toLocaleLowerCase()) {
          return -1;
        }
        if (a?.name?.toLocaleLowerCase() > b?.name?.toLocaleLowerCase()) {
          return 1;
        }
        return 0;
      });
    } else {
      this.userNameSortAsc = !this.userNameSortAsc;
      this.tempUserDetails.sort((a: UserDetails, b: UserDetails) => {
        if (a?.name?.toLocaleLowerCase() < b?.name?.toLocaleLowerCase()) {
          return 1;
        }
        if (a?.name?.toLocaleLowerCase() > b?.name?.toLocaleLowerCase()) {
          return -1;
        }
        return 0;
      });
    }
  }

  sortUserEmail() {
    if (!this.emailSortAsc) {
      this.emailSortAsc = !this.emailSortAsc;
      this.tempUserDetails.sort((a: UserDetails, b: UserDetails) => {
        if (a?.email?.toLocaleLowerCase() < b?.email?.toLocaleLowerCase()) {
          return -1; // a should come before b in the sorted order
        }
        if (a?.email?.toLocaleLowerCase() > b?.email?.toLocaleLowerCase()) {
          return 1; // a should come after b in the sorted order
        }
        return 0; // a and b are the same
      });
    } else {
      this.emailSortAsc = !this.emailSortAsc;
      this.tempUserDetails.sort((a: UserDetails, b: UserDetails) => {
        if (a?.email?.toLocaleLowerCase() < b?.email?.toLocaleLowerCase()) {
          return 1;
        }
        if (a?.email?.toLocaleLowerCase() > b?.email?.toLocaleLowerCase()) {
          return -1; // a should come after b in the sorted order
        }
        return 0; // a and b are the same
      });
    }
  }

  saveDetails(id: string, user) {
    this.userDataService.updateData(id, user).subscribe({
      next: () => {
        console.log('Record updated successfully:', id);
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Record saved' });
      },
      error: (error) => {
        console.error('Error deleting record:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error Occured' });
      }

    });
  }

  showDeleteDialog(position: string) {
    this.position = position;
    this.deleteDialogVisible = true;
  }

  deleteUser(id: string) {
    this.userDetails.splice(this.tempUserDetails.map(x => x?.id).findIndex(x => x === id), 1);
    this.userDataService.deleteData(id);
    this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
    this.deleteDialogVisible = false
  }
  deleteCanceled() {
    this.deleteDialogVisible = false
  }
  searchBar() {
    this.checked = !this.checked
  }
  goFunctionality() {
    if (this.goToNumber > 0 && this.goToNumber <= this.rows && this.table) {
      this.table.first = (this.goToNumber - 1) * this.rowsPerPageSelected;
    }
  }
}

