import { PatientsRegister } from "hospital-lib";

export async function fetchPatients() {
  const response = await fetch("http://localhost:7200/patients");
  const data = await response.json();
  return formatPatients(data);
}

export async function fetchDrugs() {
  const response = await fetch("http://localhost:7200/drugs");
  const data = await response.json();
  return formatDrugs(data);
}

function formatPatients(data: string) {
  let patients: PatientsRegister = {};
  
  data.split(",").forEach((key) => {
    if (patients[key] === undefined) {
      patients[key] = 1;
    } else {
      patients[key]++;
    }
  });
  return patients;
}

function formatDrugs(data: string) {
  if (data === "" || data === undefined) return [];
  let drugList = data.split(",");
  return drugList;
}
