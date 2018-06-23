import React, { Component } from "react";

import reelL from "./reell.svg";
import reelR from "./reelr.svg";
var FontAwesome = require("react-fontawesome");
export default class Machine extends Component {
  render() {
    return (
      <div
        id="machine"
        style={{
          borderColor:
            "rgb(" +
            this.props.comps.red[2] +
            "," +
            this.props.comps.blue[2] +
            "," +
            this.props.comps.green[2] +
            ")",
          backgroundColor:
            "rgb(" +
            this.props.comps.red[1] +
            "," +
            this.props.comps.blue[1] +
            "," +
            this.props.comps.green[1] +
            ")"
        }}
      >
        <div>
          <img
            src={reelL}
            className={
              this.props.spinning ? "App-logo App-logo-gogo" : "App-logo"
            }
            alt="logo"
          />{" "}
          <img
            src={reelR}
            className={
              this.props.spinning ? "App-logo App-logo-gogo-r" : "App-logo"
            }
            alt="logo"
          />
        </div>
        <div
          className={this.props.spinning ? "glow" : "butz"}
          style={{
            borderColor:
              "rgb(" +
              this.props.comps.red[2] +
              "," +
              this.props.comps.blue[2] +
              "," +
              this.props.comps.green[2] +
              ")",
            backgroundColor:
              "rgb(" +
              this.props.comps.red[1] +
              "," +
              this.props.comps.blue[1] +
              "," +
              this.props.comps.green[1] +
              ")"
          }}
        >
          <button onClick={this.props.clickHandler}>
            {this.props.spinning ? (
              <div className="buttonstop">
                <FontAwesome name="microphone" className="mic" />
                <FontAwesome name="play" />
              </div>
            ) : (
              <div className="buttonplay">
                <FontAwesome name="microphone" className="mic" />
                <FontAwesome name="play" />
              </div>
            )}
          </button>{" "}
        </div>
      </div>
    );
  }
}
