import React, { Component } from "react";
import Machine from "./machine";
import Login from "./login";
import "./App.css";
import SpeechToText from "./speech-to-text";
import "whatwg-fetch";
import EditBox from "./editBox";
import { Modal, FormControl, Button } from "react-bootstrap";
import { setInStorage, getFromStorage } from "./utils/storage";
const url = "http://localhost:3001/message";
//const url = "/message";

// Get a reference to the database service

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "Guest",
      loginshow: true,
      excerptIndex: 0,
      id: "",
      message: [" "],
      spinning: false,
      list: [],
      date: [],
      numLines: 0,
      capsTime: false,
      comps: complimentaries(),
      zappershow: false,
      item: [{ date: "15.05.73", mono: ["out out brief candle"] }]
    };
    this.loadStatsFromServer = this.loadStatsFromServer.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onPressPlay = this.onPressPlay.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.sendTheI = this.sendTheI.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.updateDB = this.updateDB.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.getName = this.getName.bind(this);
    this.setShow = this.setShow.bind(this);
    //this.logout = this.logout.bind(this);
    const onAnythingSaid = text => {};
    const onFinalised = text => {
      if (this.state.spinning) {
        var reply = this.state.capsTime ? jsUcfirst(text) : text;
        var tempb;
        if (weave(this.state.message[this.state.message.length - 1])) {
          tempb = this.state.message
            .slice(0, this.state.message.length - 1)
            .concat(
              iambetize(
                this.state.message[this.state.message.length - 1] + reply
              )
            );
        } else {
          tempb = this.state.message.concat(iambetize(reply));
        }
        this.setState({ message: tempb }, () => {});
      }
    };
    const onFinishedListening = text => {
      var dottedArr = punctuate(this.state.message);
      var dottedMess = dottedArr[0];
      var mark = dottedArr[1];
      this.setState({
        message: dottedMess,
        capsTime: mark === "!" || mark === "." || mark === "?" || mark === ".."
      });

      try {
        const listener = new SpeechToText(
          onAnythingSaid,
          onFinalised,
          onFinishedListening
        );
        listener.startListening();
      } catch (error) {
        console.log(error);
      }
    };
    try {
      const listener = new SpeechToText(
        onAnythingSaid,
        onFinalised,
        onFinishedListening
      );
      listener.startListening();
    } catch (error) {
      console.log(error);
    }
  }
  componentDidMount() {
    this.loadStatsFromServer();
  }
  loadStatsFromServer = () => {
    // fetch returns a promise. If you are not familiar with promises, see
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
    fetch(url)
      .then(data => data.json())
      .then(res => {
        if (!res.success) this.setState({ error: res.error });
        else
          this.setState({ list: res.data }, () => {
            this.state.list.forEach(ele => {});
          });
      });
  };
  submitStat = numLines => {
    const mono = this.state.message.slice(
      this.state.message.length - numLines - 1
    );

    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    };
    var date = new Date(Date.now()).toLocaleString("en", options);
    var user = this.state.user;

    if (mono.length > 1) {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          mono,
          user
        })
      })
        .then(res => res.json())
        .then(res => {
          if (!res.success)
            this.setState({ error: res.error.message || res.error });
          else {
            this.loadStatsFromServer();
          }
        });
    }
  };
  updateDB() {
    var id = this.state.id;
    var date = this.state.item[0].date;
    var mono = this.state.item[0].mono;

    return fetch(`${url}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        mono
      })
    })
      .then(res => res.json())
      .then(res => {
        console.log(mono, date, "UPDATED:", res.message);
        this.loadStatsFromServer();
        return res;
      })

      .catch(err => console.error(err));
  }
  handleEditXi(event, xi) {
    this.setState({ excerptIndex: xi });
  }
  zap(id) {
    return fetch(`${url}/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(res => {
        console.log("Deleted:", res.message);
        this.loadStatsFromServer();
        return res;
      })

      .catch(err => console.error(err));
  }

  getOne(id) {
    return fetch(`${url}/${id}`, { method: "GET" })
      .then(res => res.json())
      .then(res => {
        this.setState({ item: res.mono });
        return res;
      })

      .catch(err => console.error(err));
  }
  onDelete() {
    this.zap(this.state.id);
    this.setState({ zappershow: !this.state.zappershow });
  }
  onDismiss() {
    this.setState({ zappershow: !this.state.zappershow });
  }
  onPressPlay() {
    this.setState({ date: new Date().toString() });
    var tempd = this.state.message.slice(0);
    if (!this.state.spinning) {
      this.setState({ message: tempd, numLines: tempd.length });
    } else {
      this.submitStat(tempd.length - this.state.numLines);
    }
    this.setState({ spinning: !this.state.spinning });
  }
  handleEdit(event) {
    this.setState({
      excerpt: event.target.value
    });
  }
  sendTheI(i) {
    this.setState({
      excerpt: this.state.item[0].mono[i],
      excerptIndex: i
    });
  }
  updateItem(ind, excerpt) {
    var newMono = this.state.item[0].mono.slice(0);

    newMono.splice(ind, 1, excerpt);

    var newItem = [{ date: this.state.item[0].date, mono: newMono }];

    this.setState({ item: newItem }, () => {});
  }
  onLogin(name) {
    this.setState({ loginshow: false, user: name });
  }
  handleLogin(event) {
    this.setState({ user: event.target.value });
  }
  changeHandler1(event) {
    console.log(event.target.name);
    this.setState({ [event.target.name]: event.target.value });
  }
  getName(name) {
    this.setState({ user: name });
  }
  setShow(bool) {
    this.setState({ loginshow: bool });
  }
  logout() {
    this.setState({
      isLoading: true
    });
    const obj = getFromStorage("the_main_app");
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch("http://localhost:3001" + "/account/logout?token=" + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: "",
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
  render() {
    return (
      <div className="App">
        <Login
          show={this.state.loginshow}
          submit={this.onLogin}
          getName={this.getName}
          handleName={this.handleLogin}
          setShow={this.setShow}
        />
        <header
          className="App-header"
          style={{
            backgroundColor:
              "rgb(" +
              this.state.comps.red[0] +
              "," +
              this.state.comps.blue[0] +
              "," +
              this.state.comps.green[0] +
              ")"
          }}
        >
          <EditBox
            zappershow={this.state.zappershow}
            comps={this.state.comps}
            date={this.state.item[0].date}
            mono={this.state.item[0].mono}
            deleteIt={this.onDelete}
            dismissIt={this.onDismiss}
            handleEdit={this.handleEdit}
            sendTheI={this.sendTheI}
            excerpt={this.state.excerpt}
            updateItem={this.updateItem}
            updateIt={this.updateDB}
            xi={this.state.excerptIndex}
            // excerpt={this.state.item[0].mono[this.state.excerptIndex]}
          />
          <div
            className="App-palimp"
            style={{
              color:
                "rgb(" +
                this.state.comps.red[2] +
                "," +
                this.state.comps.blue[2] +
                "," +
                this.state.comps.green[2] +
                ")",
              backgroundColor:
                "rgb(" +
                this.state.comps.red[1] +
                "," +
                this.state.comps.blue[1] +
                "," +
                this.state.comps.green[1] +
                ")"
            }}
          >
            {this.state.list.map((ele, i) => {
              return (
                <div
                  key={i}
                  onClick={() => {
                    this.getOne(ele._id);
                    this.setState({
                      zappershow: !this.state.zappershow,
                      id: ele._id
                    });
                  }}
                >
                  <div className="day">
                    {" "}
                    {ele.user === this.state.user || this.state.user === "Admin"
                      ? ele.date
                      : null}
                  </div>

                  {ele.mono.map((lis, i) => {
                    return (
                      <div key={i} className="rant" onClick={() => {}}>
                        {ele.user === this.state.user ||
                        this.state.user === "Admin"
                          ? lis
                          : null}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>{" "}
          <Machine
            comps={this.state.comps}
            clickHandler={this.onPressPlay}
            spinning={this.state.spinning}
          />
        </header>
        <div
          className="App-title"
          style={{
            color:
              "rgb(" +
              this.state.comps.red[1] +
              "," +
              this.state.comps.blue[1] +
              "," +
              this.state.comps.green[1] +
              ")",
            backgroundColor:
              "rgb(" +
              this.state.comps.red[2] +
              "," +
              this.state.comps.blue[2] +
              "," +
              this.state.comps.green[2] +
              ")"
          }}
        >
          <h1 style={{ textAlign: "right", padding: "5%" }}>
            Logged in as {this.state.user}
            <Button
              onClick={() => {
                this.setState({ loginshow: true });
                this.logout();
              }}
            >
              log out
            </Button>
          </h1>{" "}
          {this.state.date}
          {this.state.message.map((ele, i) => {
            return <div key={i}>{ele}</div>;
          })}
        </div>
      </div>
    );
  }
}

function iambetize(pulp) {
  var message = [];
  var line = pulp;
  while (line_syls(line) >= 10) {
    var fragged = syls_popper(line);
    message = message.concat(
      fragged[0]
        .trim()
        .charAt(0)
        .toUpperCase() + fragged[0].trim().slice(1)
    );

    line = fragged[1];
  }

  message = message.concat(
    line
      .trim()
      .charAt(0)
      .toUpperCase() + line.trim().slice(1)
  );
  return message;
}

function new_count(word) {
  word = word.toLowerCase(); //word.downcase!
  if (word.length <= 3) {
    return 1;
  } //return 1 if word.length <= 3
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, ""); //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, ""); //word.sub!(/^y/, '')
  if (word.match(/[aeiouy]{1,2}/g) !== null) {
    return word.match(/[aeiouy]{1,2}/g).length;
  } //word.scan(/[aeiouy]{1,2}/).size
  else return 2;
}

function line_syls(line) {
  var balls = line.split(" ");

  var sylArray = balls.map(ele => {
    return new_count(ele);
  });
  var totalSyls = sylArray.reduce((ans, ele) => ans + ele);

  return totalSyls;
}

function syls_popper(line) {
  var words = line.split(" ");
  var answer = "";
  var count = 0;
  while (line_syls(answer) <= 10 && count < words.length) {
    answer = answer + " " + words[count];

    count++;
  }
  let remainder = words.slice(count).join(" ");

  return [answer, remainder];
}

function weave(line) {
  return line_syls(line) < 11;
}

function punctuate(speechArr) {
  if (
    speechArr.length > 0 &&
    speechArr[speechArr.length - 1].length > 3 &&
    speechArr[speechArr.length - 1]
      .trim()
      .charAt(speechArr[speechArr.length - 1].length - 1)
      .toLowerCase() !==
      speechArr[speechArr.length - 1]
        .trim()
        .charAt(speechArr[speechArr.length - 1].length - 1)
        .toUpperCase()
  ) {
    var mark = [".", ",", ";", "-", "?", "..", "!", ","][
      Math.floor(Math.random() * 8)
    ];
    var punkedLine = speechArr[speechArr.length - 1].trim() + mark + " ";

    return [speechArr.slice(0, speechArr.length - 1).concat(punkedLine), mark];
  }
  return [speechArr, ""];
}
function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function complimentaries() {
  var red1 = Math.floor(Math.random() * 256);
  var red2 = Math.floor(Math.random() * 256);
  var red3 = 256 - red1 - red2;
  var blu1 = Math.floor(Math.random() * 256);
  var blu2 = Math.floor(Math.random() * 256);
  var blu3 = 256 - blu1 - blu2;
  var gre1 = Math.floor(Math.random() * 256);
  var gre2 = Math.floor(Math.random() * 256);
  var gre3 = 256 - gre1 - gre2;

  return {
    red: [red1, red2, red3],
    blue: [blu1, blu2, blu3],
    green: [gre1, gre2, gre3]
  };
}

export default App;
