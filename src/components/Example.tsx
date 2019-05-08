import React from "react";
import {ReactTourProvider} from "./ReactTour/index";

export const Example = () => {
  return (
    <ReactTourProvider>
      <div>
        hello world!
      </div>
    </ReactTourProvider>
  )
};