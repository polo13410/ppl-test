import { PatientsRegister } from "./patientsRegister";
export declare class Quarantine {
    private static readonly NOT_IMPLEMENTED_MESSAGE;
    private pPatients;
    private pDrugs;
    constructor(patients: PatientsRegister);
    setDrugs(drugs: Array<string>): void;
    wait40Days(): void;
    report(): PatientsRegister;
    private setNewState;
}
