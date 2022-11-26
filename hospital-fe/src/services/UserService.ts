import { PatientsRegister } from "hospital-lib";

export async function fetchPatients(): Promise<PatientsRegister> {
  const response = await fetch("http://localhost:7200/patients");
  const data = await response.json();
  return formatPatients(data);
}

export async function fetchDrugs() {
  const response = await fetch("http://localhost:7200/drugs");
  const data = await response.json();
  return formatDrugs(data);
}

function formatPatients(list: string) {
  let patients: PatientsRegister = { F: 0, H: 0, D: 0, T: 0, X: 0 };
  list.split(",").forEach((patient) => {
    switch (patient) {
      case "F":
        patients["F"]++;
        break;
      case "D":
        patients["D"]++;
        break;
      case "T":
        patients["T"]++;
        break;
      case "H":
        patients["H"]++;
        break;
      case "X":
        patients["X"]++;
        break;
    }
  });
  return patients;
}

function formatDrugs(list: string) {
  let drugsLocal = [""];
  list.split(",").forEach((drug: any) => {
    switch (drug) {
      case "I":
        drugsLocal.push("Insulin");
        break;
      case "P":
        drugsLocal.push("Paracetamol");
        break;
      case "As":
        drugsLocal.push("Aspirin");
        break;
      case "An":
        drugsLocal.push("Antibiotics");
        break;
      case "":
        drugsLocal.push("None");
        break;
    }
  });
  return drugsLocal;
}
