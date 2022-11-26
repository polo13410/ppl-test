<template>
  <v-responsive>
    <span> </span>
    <span class="ma-2" v-for="drug in formatedDrugs">{{ drug }}</span>
  </v-responsive>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

export interface Props {
  drugsProp: Array<string>;
}
const props = defineProps<Props>();
let formatedDrugs = computed(()=>formatDrugs(props.drugsProp))


function formatDrugs(drugs: Array<string>) {
  let drugsLocal =[""];
  drugs.forEach((drug: any) => {
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

</script>
