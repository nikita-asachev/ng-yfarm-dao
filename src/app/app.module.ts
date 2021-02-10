import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import {MetaModule} from './meta/meta.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule
} from '@angular/material';
import {UtilModule} from './util/util.module';
import { DemoVotingComponent } from './pages/demo-voting/demo-voting.component';
import { VoteOverlayComponent } from './components/vote-overlay/vote-overlay.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoVotingComponent,
    VoteOverlayComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MetaModule,
    UtilModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
