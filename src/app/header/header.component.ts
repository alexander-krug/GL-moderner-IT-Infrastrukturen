import { Component, Output, EventEmitter } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import {  Subscription } from 'rxjs';
import { CountdownModule } from 'ngx-countdown';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private userSub!: Subscription;
  isAuthenticated = false;

  constructor(
    private dataStorageService: DataStorageService,
    private router: Router,
    ){}


  onSaveData(){
    this.dataStorageService.storeRecipes();
  }

  onFetchData(){
    this.dataStorageService.fetchRecipes().subscribe();
    this.router.navigate(['/recipes']);
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }
}
