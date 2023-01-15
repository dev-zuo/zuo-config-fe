import { reactive } from "vue";
import { defineStore } from "pinia";
import type { AccountInfo } from "./dto";

console.log("defineStore", defineStore);
export const useGlobalStore = defineStore("global", () => {
  const accountInfo: AccountInfo = reactive({});
  // const doubleCount = computed(() => count.value * 2);
  // function increment() {
  //   count.value++;
  // }

  return { accountInfo };
});
