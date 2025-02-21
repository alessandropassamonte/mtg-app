# Mtg Sell


## BUILD PER ANDROID [APK] 
1. Installare Capacitor (se non presente): Eseguire i comandi  
`npm install @capacitor/core  
npm install @capacitor/cli --save-dev`
2. Configurazione e inizializzazione di Capacitor `npx cap init`
3. Aggiungere Android e iOS nativi  
`npm install @capacito/ios @capacito/android`  
`npx cap add ios`  
`npx cap add android`
4. Una volta buildato l'applicativo angular, eseguire il seguente comando:  
 `npx cap sync`
5. Aprire Android Studio o altro abiente di develop per buildare l'apk eseguendo i comandi:  
`npx cap open ios`  
`npx cap open android`  
6. [OPZIONALE] Utilizzare il plugin che utilizza la fotocamera del dispositivo:  
   `npm install @capacitor/camera`  
   Se usato all'interno di una PWA:  
`npm install @ionic/pwa-elements`
   1. Es. Funzionamento  
      Modificare  il file src/main.ts (se PWA):

      ```
      import { enableProdMode } from '@angular/core';
      import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
      import { AppModule } from './app/app.module';
      import { environment } from './environments/environment';
      
      if (environment.production) {
        enableProdMode();
      } 
      
      platformBrowserDynamic().bootstrapModule(AppModule).catch(_err => console.error('err'));
      
      defineCustomElements(window);
   2. es. html:
      ```
      <div class="card-container>
        <button class="card card-small" (click)="captureImage()">
          Cattura Immagine
        </button>
      </div>
      <img [src]="image" *ngIf="image">   
      ```
      1. es. component:
         ```
         import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
   
         async captureImage() {
          const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            source: CameraSource.Prompt,
            resultType: CameraResultType.Base64
          });
          if (image) {
            this.image = `data:image/jpeg;base64,${image.base64String}`!;
          }
         ```
         1. Infine configurare i permessi modificando il file android/app/src/main/AndroidManifest.xml:
            ```
            <!-- Permissions -->
            <uses-permission android:name="android.permission.INTERNET" />
            <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
            <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
             
            ```

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
