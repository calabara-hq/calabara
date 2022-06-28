import React from "react";
import "../../css/checkpoint-bar.css";
import { ProgressBar, Step } from "react-step-progress-bar";

export default function CheckpointBar({ percent }) {

  return (
    <ProgressBar percent={percent}>
      <Step>
        {({ accomplished, index }) => (

          <div
            className={`indexedStep ${accomplished ? "accomplished" : null} ${percent == 0 ? "current" : null}`}
          >
          </div>

        )}
      </Step>
      <Step>
        {({ accomplished, index }) => (
          <div
            className={`indexedStep ${accomplished ? "accomplished" : null} ${percent == 50 ? "current" : null}`}
          >

          </div>
        )}
      </Step>
      <Step>
        {({ accomplished, index }) => (
          <div
            className={`indexedStep ${accomplished ? "accomplished" : null} ${percent == 100 ? "current" : null}`}
          >

          </div>
        )}
      </Step>
    </ProgressBar>
  );

}