import { BehaviorSubject } from 'rxjs';

//default value
export const selectedCityID = new BehaviorSubject("000");

export const updateSelectedCityID = (newID) => {
  sttID.next(newID);
};