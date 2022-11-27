import { PatientsRegister } from "./patientsRegister";
export declare class Quarantine {
    private pPatients;
    private pDrugs;
    dicDiseasesName: {
        [key: string]: string;
    };
    dicDrugsName: {
        [key: string]: string;
    };
    constructor(patients: PatientsRegister);
    setDrugs(drugs: Array<string>): void;
    wait40Days(): void;
    report(): PatientsRegister;
    private setNewState;
}
