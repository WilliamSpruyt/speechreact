import React, { Component } from "react";
import reelL from "./reell.svg";
import reelR from "./reelr.svg";
import bernie from "./bernie.svg";
import "whatwg-fetch";
import { Modal, FormControl, Button } from "react-bootstrap";
import { setInStorage, getFromStorage } from "./utils/storage";
//const url = "http://localhost:3001";
const url = "";
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,

      signUpError: "",
      signInError: "",
      signInEmail: "",
      signInPassword: "",
      signUpEmail: "",
      signUpPassword: ""
    };

    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(
      this
    );
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(
      this
    );
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(
      this
    );
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(
      this
    );
    this.onSignUp = this.onSignUp.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
  }
  componentDidMount() {
    const obj = getFromStorage("the_main_app");
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch(url + "/account/verify?token=" + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        });
    } else {
      this.setState({
        isLoading: false
      });
    }
  }
  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value
    });
  }

  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value
    });
  }

  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value
    });
  }

  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value
    });
  }
  onSignUp() {
    // Grab state
    const { signUpEmail, signUpPassword } = this.state;
    this.setState({
      isLoading: true
    });
    // Post request to backend
    fetch(url + "/accounts/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: signUpEmail,
        password: signUpPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: "",
            signUpPassword: ""
          });
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false
          });
        }
      });
  }
  onSignIn() {
    // Grab state
    const { signInEmail, signInPassword } = this.state;
    this.setState({
      isLoading: true
    });

    this.props.getName(signInEmail);
    // Post request to backend
    fetch(url + "/account/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setInStorage("the_main_app", { token: json.token });
          this.setState(
            {
              signInError: json.message,
              isLoading: false,
              signInPassword: "",
              signInEmail: "",
              token: json.token
            },
            () => {
              if (this.state.token) {
                console.log("bollox");
                this.props.setShow(false);
              }
            }
          );
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false
          });
        }
      });
  }
  render() {
    const {
      isLoading,

      signInError,
      signInEmail,
      signInPassword,
      signUpEmail,
      signUpPassword,
      signUpError
    } = this.state;
    if (isLoading) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    }
    if (this.props.show) {
      return (
        <Modal show={this.props.show} id="login" onHide={this.close}>
          <br />
          <div className="wrapper">
            <div className="centered">
              <img
                src={reelL}
                className={" App-logo-gogo-r-small"}
                alt="logo"
              />
              <img
                src={reelL}
                className={" App-logo-gogo-r-small"}
                alt="logo"
              />
              <img src={reelR} className={" App-logo-gogo-small"} alt="logo" />
              <img src={reelR} className={" App-logo-gogo-small"} alt="logo" />
              <img
                src={reelL}
                className={" App-logo-gogo-r-small"}
                alt="logo"
              />Krapp's Last App
              <img src={reelL} className={" App-logo-gogo-small"} alt="logo" />
              <img
                src={reelL}
                className={" App-logo-gogo-r-small"}
                alt="logo"
              />
              <img
                src={reelL}
                className={" App-logo-gogo-r-small"}
                alt="logo"
              />
              <img src={reelR} className={" App-logo-gogo-small"} alt="logo" />
              <img src={reelL} className={" App-logo-gogo-small"} alt="logo" />
            </div>
          </div>

          <br />
          <div>
            {signInError ? <p>{signInError}</p> : null}
            <p>Sign In</p>
            <FormControl
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={this.onTextboxChangeSignInEmail}
            />
            <br />
            <FormControl
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={this.onTextboxChangeSignInPassword}
            />
            <br />
            <Button className="butz2" onClick={this.onSignIn}>
              Sign In
            </Button>
          </div>
          <br />
          <div className="wrapper">
            <div className="centered">
              <img src={reelL} className={" App-logo-gogo-small"} alt="logo" />
              <img
                src={reelL}
                className={" App-logo-gogo-r-small"}
                alt="logo"
              />
              <img src={reelL} className={" App-logo-gogo-small"} alt="logo" />
              <img
                src={reelR}
                className={" App-logo-gogo-r-small"}
                alt="logo"
              />
              <img
                src={reelL}
                className={" App-logo-gogo-r-small"}
                alt="logo"
              />
              <img src={reelR} className={" App-logo-gogo-small"} alt="logo" />
              <img src={reelR} className={" App-logo-gogo-small"} alt="logo" />
            </div>
          </div>

          <br />
          <div>
            {signUpError ? <p>{signUpError}</p> : null}
            <p>Sign Up</p>
            <FormControl
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={this.onTextboxChangeSignUpEmail}
            />
            <br />
            <FormControl
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={this.onTextboxChangeSignUpPassword}
            />
            <br />
            <Button className="butz2" onClick={this.onSignUp}>
              Sign Up
            </Button>
          </div>
          <br />
          <div className="wrapper">
            <div className="centered">
              <img src={reelR} className={" App-logo-gogo-small"} alt="logo" />
              <img
                src={reelL}
                className={" App-logo-gogo-r-small"}
                alt="logo"
              />
              <img src={reelL} className={" App-logo-gogo-small"} alt="logo" />
              <img
                src={reelL}
                className={" App-logo-gogo-r-small"}
                alt="logo"
              />
              <img
                src={reelL}
                className={" App-logo-gogo-r-small"}
                alt="logo"
              />
              <img src={reelR} className={" App-logo-gogo-small"} alt="logo" />
              <img src={reelL} className={" App-logo-gogo-small"} alt="logo" />
              <img src={bernie} className={" App-logo-gogo-small"} alt="logo" />
            </div>
          </div>

          <br />
        </Modal>
      );
    }
    return (
      <div>
        <p>Signed in</p>
      </div>
    );
  }
}
