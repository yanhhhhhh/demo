import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Providers } from "./providers";
import router from "./router/index.tsx";
import "@/utils/echartConfig.ts";
import "@/utils/i18nConfig.ts";
import "@/assets/styles/global.less";
import "./index.less";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>
);
