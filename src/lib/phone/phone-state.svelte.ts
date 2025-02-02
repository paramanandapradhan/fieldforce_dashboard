import type { PhoneDataModel, PhonePlivoData } from "./phone-types";

let phoneNumbers: PhonePlivoData[] = $state([]);
let selectedPhoneNumber: PhonePlivoData | null = $state(null);
let boughtPhoneNumber: PhoneDataModel | null = $state(null);

export function setPhoneNumbers(numbers: PhonePlivoData[]) {
    phoneNumbers = numbers;
}

export function setSelectedPhoneNumber(number: PhonePlivoData) {
    selectedPhoneNumber = number;
}

export function setBoughtPhoneNumber(number: PhoneDataModel) {
    boughtPhoneNumber = number;
}


export function getPhoneNumbers() {
    return phoneNumbers
}

export function getSelectedPhoneNumber() {
    return selectedPhoneNumber
}


export function getBoughtPhoneNumber() {
    return boughtPhoneNumber
}

export function resetPhoneNumbersStates() {
    boughtPhoneNumber = null;
    selectedPhoneNumber = null;
    phoneNumbers = [];
}
