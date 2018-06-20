import React, { Component } from "react";
import { Modal, FormControl, Button } from "react-bootstrap";

export default class EditBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showme: false,
      excerpt: "none"
    };
  }

  render() {
    return (
      <Modal
        dialogClassName="custom-modal"
        show={this.props.zappershow}
        style={{
          color:
            "rgb(" +
            this.props.comps.red[2] +
            "," +
            this.props.comps.blue[2] +
            "," +
            this.props.comps.green[2] +
            ")"
        }}
      >
        <div
          style={{
            backgroundColor:
              "rgb(" +
              this.props.comps.red[2] +
              "," +
              this.props.comps.blue[2] +
              "," +
              this.props.comps.green[2] +
              ")",
            color:
              "rgb(" +
              this.props.comps.red[0] +
              "," +
              this.props.comps.blue[0] +
              "," +
              this.props.comps.green[0] +
              ")"
          }}
          className="paneldate"
        >
          {this.props.date}
        </div>

        <div
          className="panel"
          style={{
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
          {this.props.mono.map((ele, i) => {
            return (
              <div
                className="excerpt"
                key={i}
                onClick={() => {
                  this.setState({
                    showme: !this.state.showme
                  });
                  this.props.sendTheI(i);
                }}
              >
                {ele}
              </div>
            );
          })}
        </div>
        <div className="panelbuttons">
          <Button className="buttonstop" onClick={this.props.deleteIt}>
            Delete?
          </Button>
          <Button className="buttonplay" onClick={this.props.updateIt}>
            Update?
          </Button>
          <Button className="buttonplay" onClick={this.props.dismissIt}>
            ..Or Not?
          </Button>
        </div>
        <Modal show={this.state.showme} className="writebox">
          <div id="inline">
            <FormControl
              className="one"
              onChange={this.props.handleEdit}
              value={this.props.excerpt}
            />{" "}
            <Button
              style={{
                backgroundColor:
                  "rgb(" +
                  this.props.comps.red[1] +
                  "," +
                  this.props.comps.blue[1] +
                  "," +
                  this.props.comps.green[1] +
                  ")"
              }}
              className="two "
              onClick={() => {
                this.props.updateItem(this.props.xi, this.props.excerpt);
                this.setState({
                  showme: !this.state.showme
                });
              }}
            >
              Done
            </Button>
          </div>
        </Modal>
      </Modal>
    );
  }
}
