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
  let patients: PatientsRegister = {};
  list.split(",").forEach((key) => {
    if (patients[key] === undefined || patients[key] < 0) {
      patients[key] = 0;
    }
    patients[key]++;
  });
  return patients;
}

function formatDrugs(list: string) {
  return list.split(",");
}
