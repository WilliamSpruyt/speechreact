Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var SpeechToText = (function() {
  /*
  Arguments for the constructor.
   onAnythingSaid - a callback that will be passed interim transcriptions
  (fairly immediate, less accurate)
   onFinalised - a callback that will be passed the finalised transcription from the cloud
  (slow, much more accuate)
   onFinishedListening - a callback that will be called when the speech recognition stops listening
   language - the language to interpret against. Default is US English.
  */
  function SpeechToText(onAnythingSaid, onFinalised, onFinishedListening) {
    var language =
      arguments.length > 3 && arguments[3] !== undefined
        ? arguments[3]
        : "en-GB";

    _classCallCheck(this, SpeechToText);

    // Check to see if this browser supports speech recognition
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      throw new Error(
        "This browser doesn't support speech recognition. Try Google Chrome or Firefox."
      );
    }

    var SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    this.recognition = new SpeechRecognition();

    //  Keep listening even if the speaker pauses, and return interim results.
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = language;

    var finalTranscript = "";

    // process both interim and finalised results
    this.recognition.onresult = function(event) {
      var interimTranscript = "";

      // concatenate all the transcribed pieces together (SpeechRecognitionResult)
      for (var i = event.resultIndex; i < event.results.length; i += 1) {
        var transcriptionPiece = event.results[i][0].transcript;
        // check for a finalised transciption in the cloud
        // There is a weird bug on mobile, where everything is repeated twice.
        // There is no official solution so far so we have to handle an edge case. willy
        var mobileRepeatBug =
          event.resultIndex === 1 &&
          transcriptionPiece === event.results[0][0].transcript;
        if (event.results[i].isFinal && !mobileRepeatBug) {
          finalTranscript += transcriptionPiece;
          onFinalised(finalTranscript);
          finalTranscript = "";
        } else {
          interimTranscript += transcriptionPiece;
          onAnythingSaid(interimTranscript);
        }
      }
    };

    this.recognition.onend = function() {
      return onFinishedListening();
    };
  }

  _createClass(SpeechToText, [
    {
      key: "stopListening",
      value: function stopListening() {
        this.recognition.stop();
      }

      /*
    Explicitly start listening.
    Listening will need to be started again after a finalised result is returned.
    */
    },
    {
      key: "startListening",
      value: function startListening() {
        this.recognition.start();
      }
    }
  ]);

  return SpeechToText;
})();

exports.default = SpeechToText;
