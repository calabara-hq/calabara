import React from "react";
import "../../css/checkpoint-bar.css";
import { ProgressBar, Step } from "react-step-progress-bar";

export function ContestDurationCheckpointBar({ percent }) {

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

export function ContestSubmissionCheckpointBar({ percent }) {

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
            className={`indexedStep ${accomplished ? "accomplished" : null} ${percent == 33 ? "current" : null}`}
          >

          </div>
        )}
      </Step>
      <Step>
        {({ accomplished, index }) => (
          <div
            className={`indexedStep ${accomplished ? "accomplished" : null} ${percent == 66 ? "current" : null}`}
          >

          </div>
        )}
      </Step>
      <Step>
        {({ accomplished, index }) => (
          <div
            className={`indexedStep ${accomplished ? "accomplished" : null} ${percent == 99 ? "current" : null}`}
          >

          </div>
        )}
      </Step>
    </ProgressBar>
  );

}