import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WikiComponent } from './components/wiki/wiki.component';
import { DetailComponent } from './components/detail/detail.component';

export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'wiki', component: WikiComponent},
  {path: 'detail/{id}', component: DetailComponent},
  { path:'', pathMatch:'full', redirectTo:'home' },
  { path:'**', pathMatch:'full', redirectTo:'home' }
];
