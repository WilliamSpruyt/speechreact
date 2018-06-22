import React, { Component } from "react";
import { Modal, FormControl, Button } from "react-bootstrap";

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal show={this.props.show} id="login">
        <FormControl
          className="one"
          onChange={this.props.handleName}
          value={this.props.name}
        />{" "}
        <FormControl
          className="one"
          onChange={this.props.handlePassword}
          value={this.props.password}
        />{" "}
        <Button
          onClick={() => {
            this.props.submit();
          }}
        >
          LOGIN
        </Button>
      </Modal>
    );
  }
}
