import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import { render } from "solid-js/web";
import App from "./App";
import "./index.css";
// eslint-disable-next-line @typescript-eslint/no-floating-promises
tf.setBackend("webgl");

render(() => <App />, document.getElementById("root") as HTMLElement);
