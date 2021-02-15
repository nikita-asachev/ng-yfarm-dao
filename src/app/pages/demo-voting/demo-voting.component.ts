import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DialogData, VoteOverlayComponent} from '../../components/vote-overlay/vote-overlay.component';
import {Web3Service} from '../../util/web3.service';
import {Subscription} from 'rxjs';

declare let require: any;
const voting_artifact = require('../../../../build/contracts/Voting.json');

const BN = require('bn.js');

@Component({
  selector: 'app-demo-voting',
  templateUrl: './demo-voting.component.html',
  styleUrls: ['./demo-voting.component.scss']
})
export class DemoVotingComponent implements OnInit {

  votingContract: any;

  dialogSub: Subscription;

  model = {
    account: null
  };

  constructor(public dialog: MatDialog, private web3Service: Web3Service) { }

  ngOnInit() {
    this.watchAccount();
    this.web3Service.artifactsToContract(voting_artifact).then((votinAbstraction) => {
      this.votingContract = votinAbstraction;
      console.log('Voting absctraction');
      this.votingContract.deployed().then(deployed => {
        const f = new BN(10).mul(new BN(10).pow(new BN(18)));
        const s = new BN(10).mul(new BN(10).pow(new BN(19)));
        // deployed.initialize.sendTransaction('0x0000000000b3F879cb30FE243b4Dfee438691c04', f, s, 1000, {from: this.model.account}).then((resp) => {
        //   console.log('resp ', resp);
        // }, (err) => {
        //   console.error('err = ', err);
        // });
        console.log('Deployed ', deployed);
      });
    });
  }

  ngOnDestroy() {
    if (!this.dialogSub) {
      return;
    }
    this.dialogSub.unsubscribe();
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.model.account = accounts[0];
      console.log('Accounts: ', accounts);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(VoteOverlayComponent);
    this.dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.makeNewVote(result);
      }

      this.dialogSub.unsubscribe();
    });
  }

  async makeNewVote(voteDialogData: DialogData) {
    console.log('Making new vote ', voteDialogData);

    try {
      const deployedVoting = await this.votingContract.deployed();
      console.log('Deployed voting ', deployedVoting);
      console.log('account = ', this.model.account);
      const transaction = await deployedVoting.newVote.sendTransaction('0x0000000000000000000000000000000000000000', 'question', {from: this.model.account});
      console.log('trans = ', transaction);

      // console.log('Transaction = ', transaction);
    } catch (e) {
      console.error('New vote error ', e);
    }
  }

}
