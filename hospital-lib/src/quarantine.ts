import { PatientsRegister } from "./patientsRegister";

export class Quarantine {
  private static readonly NOT_IMPLEMENTED_MESSAGE = "Work, work.";
  private pPatients: PatientsRegister = undefined;
  private pDrugs: Array<string> = undefined;

  constructor(patients: PatientsRegister) {
    this.pPatients = patients;
  }

  public setDrugs(drugs: Array<string>): void {
    this.pDrugs = drugs;
  }

  public wait40Days(): void {
    if (this.pDrugs === undefined || this.pDrugs.length === 0) {
      this.setNewState("D", "X");
      return;
    }

    if (
      this.pDrugs.find((elem) => elem === "As") &&
      this.pDrugs.find((elem) => elem === "P")
    ) {
      this.setNewState("F", "X");
      this.setNewState("H", "X");
      this.setNewState("D", "X");
      this.setNewState("T", "X");
    } else {
      if (
        this.pDrugs.find((elem) => elem === "As") ||
        this.pDrugs.find((elem) => elem === "P")
      ) {
        this.setNewState("F", "H");
      }
      if (this.pDrugs.find((elem) => elem === "An")) {
        if (this.pDrugs.find((elem) => elem === "I")) {
          this.setNewState("H", "F");
        }
        this.setNewState("T", "H");
      }
      if (!this.pDrugs.find((elem) => elem === "I") /*No insulin*/) {
        this.setNewState("D", "X");
      }
    }
  }

  public report(): PatientsRegister {
    return this.pPatients;
  }

  //private methods
  private setNewState(from: string, to: string) {
    let numFrom = this.pPatients[from];
    if (numFrom == 0) {
      return;
    }
    this.pPatients[to] += numFrom;
    this.pPatients[from] = 0;
  }
}
