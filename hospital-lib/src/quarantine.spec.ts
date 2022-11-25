import { Expect, Setup, Test, TestFixture } from "alsatian";
import { Quarantine } from "./quarantine";
import { PatientsRegister } from "./patientsRegister";

interface testObj {
  input: Quarantine;
  expected: PatientsRegister[];
}

@TestFixture()
export class QuarantineTest {
  private quarantines: testObj[];

  @Setup
  public setup() {
    // The responsibility of the Quarantine object is to simulate diseases on a group of patients.
    // It is initialized with a list of patients' health status, separated by a comma.
    // Each health status is described by one or more characters
    // (in the test below, we will always have only one disease / patient)
    // The characters mean:
    // H : Healthy
    // F : Fever
    // D : Diabetes
    // T : Tuberculosis
    this.quarantines = [
      {
        input: new Quarantine({ F: 1, H: 2, D: 3, T: 1, X: 0 }),
        expected: [
          { F: 1, H: 2, D: 3, T: 1, X: 0 },
          { F: 1, H: 2, D: 0, T: 1, X: 3 },
          { F: 0, H: 3, D: 0, T: 1, X: 3 },
          { F: 1, H: 3, D: 0, T: 0, X: 3 },
          { F: 1, H: 2, D: 3, T: 1, X: 0 },
          { F: 3, H: 1, D: 3, T: 0, X: 0 },
          { F: 0, H: 3, D: 0, T: 1, X: 3 },
          { F: 0, H: 0, D: 0, T: 0, X: 7 },
        ],
      },
      {
        input: new Quarantine({ F: 6, H: 4, D: 6, T: 1, X: 1 }),
        expected: [
          { F: 6, H: 4, D: 6, T: 1, X: 1 },
          { F: 6, H: 4, D: 0, T: 1, X: 7 },
          { F: 0, H:10, D: 0, T: 1, X: 7 },
          { F: 6, H: 5, D: 0, T: 0, X: 7 },
          { F: 6, H: 4, D: 6, T: 1, X: 1 },
          { F: 10, H: 1, D: 6, T: 0, X: 1 },
          { F: 0, H: 10, D: 0, T: 1, X: 7 },
          { F: 0, H: 0, D: 0, T: 0, X: 18 },
        ],
      },
      {
        input: new Quarantine({ F: 0, H: 0, D: 0, T: 0, X: 10 }),
        expected: [
          { F: 0, H: 0, D: 0, T: 0, X: 10 },
          { F: 0, H: 0, D: 0, T: 0, X: 10 },
          { F: 0, H: 0, D: 0, T: 0, X: 10 },
          { F: 0, H: 0, D: 0, T: 0, X: 10 },
          { F: 0, H: 0, D: 0, T: 0, X: 10 },
          { F: 0, H: 0, D: 0, T: 0, X: 10 },
          { F: 0, H: 0, D: 0, T: 0, X: 10 },
          { F: 0, H: 0, D: 0, T: 0, X: 10 },
        ],
      },
    ];

    // Quarantine provides medicines to the patients, but can not target a specific group of patient.
    // The same medicines are always given to all the patients.

    // Then Quarantine can provide a report that gives the number of patients that have the given disease.
    // X means Dead
  }

  @Test()
  public beforeTreatment(): void {
    this.quarantines.forEach((quar) => {
      Expect(quar.input.report()).toEqual(quar.expected[0]);
    });
  }

  @Test()
  public noTreatment(): void {
    // diabetics die without insulin
    this.quarantines.forEach((quar) => {
      quar.input.wait40Days();
      Expect(quar.input.report()).toEqual(quar.expected[1]);
    });
  }

  @Test()
  public aspirin(): void {
    this.quarantines.forEach((quar) => {
      quar.input.setDrugs(["As"]);
      quar.input.wait40Days();
      // aspirin cure Fever
      Expect(quar.input.report()).toEqual(quar.expected[2]);
    });
  }

  @Test()
  public antibiotic(): void {
    this.quarantines.forEach((quar) => {
      quar.input.setDrugs(["An"]);
      quar.input.wait40Days();
      // antibiotic cure Tuberculosis
      // but healthy people catch Fever if mixed with insulin.
      Expect(quar.input.report()).toEqual(quar.expected[3]);
    });
  }

  @Test()
  public insulin(): void {
    this.quarantines.forEach((quar) => {
      quar.input.setDrugs(["I"]);
      quar.input.wait40Days();
      // insulin prevent diabetic subject from dying, does not cure Diabetes,
      Expect(quar.input.report()).toEqual(quar.expected[4]);
    });
  }

  @Test()
  public antibioticPlusInsulin(): void {
    this.quarantines.forEach((quar) => {
      quar.input.setDrugs(["An", "I"]);
      quar.input.wait40Days();
      // if insulin is mixed with antibiotic, healthy people catch Fever
      // startup => F: 1, H: 2, D: 3, T: 1, X: 0
      Expect(quar.input.report()).toEqual(quar.expected[5]);
    });
  }

  @Test()
  public paracetamol(): void {
    this.quarantines.forEach((quar) => {
      quar.input.setDrugs(["P"]);
      quar.input.wait40Days();
      // paracetamol heals fever
      Expect(quar.input.report()).toEqual(quar.expected[6]);
    });
  }

  @Test()
  public paracetamolAndAspirin(): void {
    this.quarantines.forEach((quar) => {
      quar.input.setDrugs(["P", "As"]);
      quar.input.wait40Days();
      // paracetamol kills subject if mixed with aspirin
      Expect(quar.input.report()).toEqual(quar.expected[7]);
    });
  }
}
