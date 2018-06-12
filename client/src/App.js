import React, { Component } from "react";
import logo from "./logo.svg";
import reelL from "./reell.svg";
import reelR from "./reelr.svg";
import "./App.css";
import SpeechToText from "speech-to-text";
import "whatwg-fetch";
var FontAwesome = require("react-fontawesome");

const API_PORT = process.env.PORT | 3001;
const url = "/message";

// Get a reference to the database service

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: [" "],
      spinning: false,
      list: [],
      date: [],
      numLines: 0,
      capsTime: false
    };
    this.loadStatsFromServer = this.loadStatsFromServer.bind(this);

    const onAnythingSaid = text => console.log(`Interim text: ${text}`);
    const onFinalised = text => {
      if (this.state.spinning) {
        console.log(`Final text: ${text}`);
        var reply = this.state.capsTime ? jsUcfirst(text) : text;
        console.log(reply);
        if (weave(this.state.message[this.state.message.length - 1])) {
          var tempb = this.state.message
            .slice(0, this.state.message.length - 1)
            .concat(
              iambetize(
                this.state.message[this.state.message.length - 1] + reply
              )
            );
        } else {
          var tempb = this.state.message.concat(iambetize(reply));
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
      console.log("stopped listening" + this.state.capsTime + mark);

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

    if (mono.length > 1) {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          mono
        })
      })
        .then(res => res.json())
        .then(res => {
          if (!res.success)
            this.setState({ error: res.error.message || res.error });
          else {
            // this.props.getStats();
          }
        });
    }
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div id="machine">
            <img
              src={reelL}
              className={
                this.state.spinning ? "App-logo App-logo-gogo" : "App-logo"
              }
              alt="logo"
            />
            <button
              onClick={() => {
                this.setState({ date: new Date().toString() });
                var tempd = this.state.message.slice(0);
                if (!this.state.spinning) {
                  this.setState({ message: tempd, numLines: tempd.length });
                } else {
                  this.submitStat(tempd.length - this.state.numLines);
                }
                this.setState({ spinning: !this.state.spinning });
              }}
            >
              {this.state.spinning ? (
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
            <img
              src={reelR}
              className={
                this.state.spinning ? "App-logo App-logo-gogo" : "App-logo"
              }
              alt="logo"
            />
          </div>
        </header>
        <div className="App-palimp">
          {this.state.date}
          {this.state.list.map((ele, i) => {
            return (
              <div key={i}>
                <div className="day"> {ele.date}</div>

                {ele.mono.map((lis, i) => {
                  return (
                    <div key={i} className="rant">
                      {lis}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="App-title">
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
        .toUpperCase() + (fragged[0] + " ").trim().slice(1)
    );

    line = fragged[1];
  }

  message = message.concat(
    line
      .trim()
      .charAt(0)
      .toUpperCase() + (line + " ").trim().slice(1)
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

export default App;
