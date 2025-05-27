// index.js.template
import { StrictMode, lazy, Suspense } from "react";
 import { createRoot } from "react-dom/client";
 import { BrowserRouter } from "react-router-dom";
 import { init } from "@module-federation/runtime";

init({
  name: "web_host",
  remotes: [
 {
      name: "web_remote1",
      entry: `${process.env.REMOTE_BASE_URL}:"4201"/remoteEntry.js?v=${+Date.now()}`,
 },
 {
      name: "web_remote2",
      entry: `${process.env.REMOTE_BASE_URL}:"4202"/remoteEntry.js?v=${+Date.now()}`,
 },
 {
      name: "web_remote3",
      entry: `${process.env.REMOTE_BASE_URL}:"4203"/remoteEntry.js?v=${+Date.now()}`,
 },
 {
      name: "web_remote4",
      entry: `${process.env.REMOTE_BASE_URL}:"4204"/remoteEntry.js?v=${+Date.now()}`,
 }
 ]
 });

import('./bootstrap');
