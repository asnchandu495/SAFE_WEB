import React from "react";

function Questionaire(props) {
  function gotoAddQuestion() {
    props.history.push("/questionaires/add-questions/1/1");
  }

  return (
    <div>
      <h4>Welcome</h4>
      <button onClick={gotoAddQuestion}>Add question</button>
    </div>
  );
}

export default Questionaire;
