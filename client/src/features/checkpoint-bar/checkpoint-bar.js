import React from "react";
import "../../css/checkpoint-bar.css";
import { ProgressBar, Step } from "react-step-progress-bar";

function WidgetsCheckpointBar({percent}) {

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
              className={`indexedStep ${accomplished ? "accomplished" : null} ${percent == 33.3333 ? "current" : null}`}
            >

            </div>
          )}
        </Step>
        <Step>
          {({ accomplished, index }) => (
            <div
              className={`indexedStep ${accomplished ? "accomplished" : null} ${percent == 66.6667 ? "current" : null}`}
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

function SettingsCheckpointBar({percent}) {

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
              className={`indexedStep ${accomplished ? "accomplished" : null} ${percent == 25 ? "current" : null}`}
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
              className={`indexedStep ${accomplished ? "accomplished" : null} ${percent == 75 ? "current" : null}`}
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

function FinalizeSettingsCheckpointBar({percent}) {

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
            className={`indexedStep ${accomplished ? "accomplished" : null} ${percent == 100 ? "current" : null}`}
          >

          </div>

        )}
      </Step>
</ProgressBar>
  );

}


export {WidgetsCheckpointBar, SettingsCheckpointBar, FinalizeSettingsCheckpointBar}
