import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class BadgeService
{
  private _subject = new Subject<any>();

  sendEventBadge(event: any) {
    this._subject.next(event);
  }
  sendPendingOrderEventBadge(event: any) {
    this._subject.next(event);
  }
  get events$ () {
    return this._subject.asObservable();
  }
  
  get pendingEvents$ () {
    return this._subject.asObservable();
  }

}