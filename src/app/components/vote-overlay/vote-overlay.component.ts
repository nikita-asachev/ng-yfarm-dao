import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  tokenA: string;
  tokenB: string;
  liquidityPoolToken: string;
  stakingContractAddress: string;
}

@Component({
  selector: 'app-vote-overlay',
  templateUrl: './vote-overlay.component.html',
  styleUrls: ['./vote-overlay.component.scss']
})
export class VoteOverlayComponent {
  dialogData: DialogData = {
    tokenA: '',
    tokenB: '',
    liquidityPoolToken: '',
    stakingContractAddress: ''
  };

  constructor(private dialogRef: MatDialogRef<VoteOverlayComponent>) { }

  public onNoClick(): void {
    this.dialogRef.close();
  }

}
