import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

function QuestionType(props) {
  useEffect(() => {}, []);

  const navigateToQuestionDetails = () => {
    setTimeout(() => {
      props.setGotoAddQuestion(true);
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    props.setQuestionTypeForm((questionTypeForm) => ({
      ...props.questionTypeForm,
      [name]: value,
    }));
  };

  return (
    <Card className="question-type-card">
      <CardContent>
        <Typography gutterBottom variant="h6" component="h6">
          Question type
        </Typography>
        <div className="card-form">
          <FormControl variant="outlined" fullWidth>
            <InputLabel
              id="demo-simple-select-outlined-label"
              shrink={false}
              className="select-label"
            >
              {props.questionTypeForm.questionType != "" ? "" : "Question type"}
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={props.questionTypeForm.questionType}
              name="questionType"
              onChange={handleChange}
              placeholder="Question type"
              InputLabelProps={{ shrink: false }}
              className="global-input single-select"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {props.questionTypes.map((qType) => {
                return (
                  <MenuItem value={qType.id} key={`qtype_${qType.id}`}>
                    {qType.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
      </CardContent>
      <CardActions className="action-container">
        <Button
          type="button"
          onClick={navigateToQuestionDetails}
          size="small"
          color="primary"
        >
          Next
        </Button>
      </CardActions>
    </Card>
  );
}

export default QuestionType;
