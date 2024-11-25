import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  constructor() { }
  showHelp = signal(false);
}
