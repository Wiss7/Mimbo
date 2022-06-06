import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'edible',
    loadChildren: () =>
      import('./edible/edible.module').then((m) => m.EdiblePageModule),
  },
  {
    path: 'breeds-info',
    loadChildren: () =>
      import('./breeds-info/breeds-info.module').then(
        (m) => m.BreedsInfoPageModule
      ),
  },
  {
    path: 'training-tools',
    loadChildren: () =>
      import('./training-tools/training-tools.module').then(
        (m) => m.TrainingToolsPageModule
      ),
  },
  {
    path: 'body-language',
    loadChildren: () =>
      import('./body-language/body-language.module').then(
        (m) => m.BodyLanguagePageModule
      ),
  },
  {
    path: 'vets-near-by',
    loadChildren: () =>
      import('./vets-near-by/vets-near-by.module').then(
        (m) => m.VetsNearByPageModule
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'signin',
    loadChildren: () =>
      import('./auth/signin/signin.module').then((m) => m.SigninPageModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./auth/signup/signup.module').then((m) => m.SignupPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
