import { BehaviorSubject } from 'rxjs';

const sttIdSubject = new BehaviorSubject(null);

export const sttIdObservable = sttIdSubject.asObservable();

export function updateSttId(sttId) {
  sttIdSubject.next(sttId);
}