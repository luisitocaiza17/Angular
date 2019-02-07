import {Injectable} from '@angular/core';
import {BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/share';

@Injectable()
export class SpinnerService {

  static instance: SpinnerService;

  constructor() {
    return SpinnerService.instance = SpinnerService.instance || this;
  }

  public status: BehaviorSubject <boolean> = new BehaviorSubject <boolean>(false);

  public start(): void {
    this.status.next(true);
  }

  public stop(): void {
    this.status.next(false);
  }
}