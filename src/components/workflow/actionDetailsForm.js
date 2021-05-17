import React, { useEffect } from "react";

function ActionDetailsForm(props) {
  useEffect(() => {
    console.log(props.formData.configurationDataList);
  }, [props]);
  return (
    <div>
      {props.formData.configurationDataList.map((item) => {
        return <li>{item.value}</li>;
      })}
    </div>
  );
}

export default ActionDetailsForm;
