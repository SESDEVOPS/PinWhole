


import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class WalletService
{
  private _subject = new Subject<any>();

  sendBallance(event: any) {
    this._subject.next(event);
  }

  get events$ () {
    return this._subject.asObservable();
  }
}