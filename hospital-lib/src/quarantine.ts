import { PatientsRegister } from "./patientsRegister";

export class Quarantine {
  private pPatients: PatientsRegister = undefined;
  private pDrugs: Array<string> = undefined;

  // Dictionnary with every diseases
  public dicDiseasesName: { [key: string]: string } = {
    F: "Fever",
    D: "Diabete",
    T: "Tuberculosis",
    H: "Healthy",
    X: "Dead",
  };

  public dicDrugsName: { [key: string]: string } = {
    An: "Antibiotics",
    As: "Aspirin",
    I: "Insulin",
    P: "Paracetamol"
  };

  constructor(patients: PatientsRegister) {
    //Clone to cancel modification of the object patients
    this.pPatients = { ...patients };
  }

  public setDrugs(drugs: Array<string>): void {
    this.pDrugs = drugs;
  }

  public wait40Days(): void {
    if (this.pDrugs == undefined || this.pDrugs.length == 0) {
      //!I = D -> X
      this.setNewState("D", "X");
      return; //Nothing more to do
    }

    if (
      this.pDrugs.find((elem) => elem == "As") &&
      this.pDrugs.find((elem) => elem == "P")
    ) {
      Object.keys(this.dicDiseasesName).forEach((key) => {
        //Doesn't apply to already dead
        if (key != "X") {
          // As+P = everyone X
          this.setNewState(key, "X");
        }
      });
    } else {
      if (
        this.pDrugs.find((elem) => elem == "As") ||
        this.pDrugs.find((elem) => elem == "P")
      ) {
        //As | P = F -> H
        this.setNewState("F", "H");
      }
      if (this.pDrugs.find((elem) => elem == "An")) {
        if (this.pDrugs.find((elem) => elem == "I")) {
          //An+I H -> F
          this.setNewState("H", "F");
        }
        //THEN An = T -> H
        this.setNewState("T", "H");
      }
      if (!this.pDrugs.find((elem) => elem == "I")) {
        //!I = D -> X
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
    if (numFrom == 0 || numFrom == NaN || numFrom == undefined) {
      return;
    } //If empty no need for calculation

    if (this.pPatients[to] == NaN || this.pPatients[to] == undefined) {
      this.pPatients[to] = 0;
    }
    this.pPatients[to] += numFrom; //Adding patients to new state
    this.pPatients[from] = 0; //removing patients from old state
  }
}
