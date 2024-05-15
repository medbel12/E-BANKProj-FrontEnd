import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AccountDetails, AccountOperation } from '../model/account.model';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accountId!: string;
  selectedAccount: AccountDetails | null = null;
  operations: AccountOperation[] = [];
  operationFormGroup!: FormGroup;

  constructor(private accountService: AccountService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.operationFormGroup = this.formBuilder.group({
      operationType: ['', Validators.required],
      accountDestination: [''],
      amount: ['', Validators.required],
      description: ['']
    });
  }

  searchAccount(): void {
    if (!this.accountId) {

      return;
    }


    this.accountService.getAccount(this.accountId).subscribe(account => {
      this.selectedAccount = account;
    });


    this.accountService.getAccountHistory(this.accountId).subscribe(operations => {
      this.operations = operations;
    });
  }

  handleAccountOperation(): void {
    const operationType: string = this.operationFormGroup.value.operationType;
    const amount: number = this.operationFormGroup.value.amount;
    const description: string = this.operationFormGroup.value.description;
    const accountDestination: string = this.operationFormGroup.value.accountDestination;

    if (operationType === 'DEBIT') {
      this.accountService.debit(this.accountId, amount, description).subscribe(() => {
        this.searchAccount();
        this.operationFormGroup.reset();
      });
    } else if (operationType === 'CREDIT') {
      this.accountService.credit(this.accountId, amount, description).subscribe(() => {
        this.searchAccount();
        this.operationFormGroup.reset();
      });
    } else if (operationType === 'TRANSFER') {
      this.accountService.transfer(this.accountId, accountDestination, amount).subscribe(() => {
        this.searchAccount();
        this.operationFormGroup.reset();
      });
    }
  }
}
