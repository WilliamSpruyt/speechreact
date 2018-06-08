import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import SpeechToText from "speech-to-text";

class App extends Component {
  constructor(props) {
    super(props);
    let temptext = " ";
    const onAnythingSaid = text => console.log(`Interim text: ${text}`);
    const onFinalised = text => {
      if (this.state.spinning) {
        console.log(`Final text: ${text}`);
        var line = text;

        while (line_syls(line) >= 10) {
          var fragged = syls_popper(line);
          var tempb = this.state.message.concat(
            fragged[0]
              .trim()
              .charAt(0)
              .toUpperCase() +
              (fragged[0] + " ").trim().slice(1) +
              [".", ",", ";", "-", " "][Math.floor(Math.random() * 5)]
          );
          this.setState({ message: tempb });
          line = fragged[1];
        }

        temptext = line;

        console.log("temptext ", temptext);
      }
    };
    const onFinishedListening = text => console.log("Not Listening!");
    this.state = {
      message: [],

      spinning: false
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
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img
            src={logo}
            className={
              this.state.spinning ? "App-logo App-logo-gogo" : "App-logo"
            }
            alt="logo"
          />
          <button
            onClick={() => {
              this.setState({ spinning: !this.state.spinning });
            }}
          >
            {this.state.spinning ? "STOP" : "START"}
          </button>
        </header>
        <div className="App-intro">
          <div className="App-title">
            {this.state.message.map((ele, i) => {
              return <div key={i}>{ele}</div>;
            })}
          </div>
        </div>
      </div>
    );
  }
}
function new_count(word) {
  word = word.toLowerCase(); //word.downcase!
  if (word.length <= 3) {
    return 1;
  } //return 1 if word.length <= 3
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, ""); //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
  word = word.replace(/^y/, ""); //word.sub!(/^y/, '')
  return word.match(/[aeiouy]{1,2}/g).length; //word.scan(/[aeiouy]{1,2}/).size
}

function line_syls(line) {
  let balls = line.split(" ");

  let sylArray = balls.map(ele => {
    return new_count(ele);
  });
  let totalSyls = sylArray.reduce((ans, ele) => ans + ele);

  return totalSyls;
}
export default App;

function syls_popper(line) {
  var words = line.split(" ");
  var answer = "";
  var count = 0;
  while (line_syls(answer) <= 10 && count < words.length) {
    answer = answer + " " + words[count];

    count++;
  }
  let remainder = words.slice(count).join(" ");
  console.log("answer;+ " + answer + " remainder;+ " + remainder);
  return [answer, remainder];
}
