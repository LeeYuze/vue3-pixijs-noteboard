import { createApp } from "vue";
import App from "./app.vue";
import router from "./router";

import "@/assets/styles/index.less"

const app = createApp(App);

app.use(router);

app.mount("#app");
