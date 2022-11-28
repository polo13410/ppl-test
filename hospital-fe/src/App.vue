<template>
  <v-app>
    <v-main>
      <v-container class="fill-height">
        <v-app-bar color="primary" :elevation="1">
          <v-app-bar-title> PropulseLab test </v-app-bar-title>
        </v-app-bar>
        <Simulations />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Simulations from "@/views/Simulations.vue";
</script>
