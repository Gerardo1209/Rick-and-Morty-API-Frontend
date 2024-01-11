import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WikiComponent } from './components/wiki/wiki.component';
import { DetailComponent } from './components/detail/detail.component';
import { SearchComponent } from './components/search/search.component';

export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'wiki', component: WikiComponent},
  {path: 'wiki/:page', component: WikiComponent},
  {path: 'character', component: DetailComponent},
  {path: 'character/:id', component: DetailComponent},
  {path: 'search', component: SearchComponent},
  { path:'', pathMatch:'full', redirectTo:'home' },
  { path:'**', pathMatch:'full', redirectTo:'home' }
];
