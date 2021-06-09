import React, { Fragment, useState, useCallback, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Dropzone from "react-dropzone";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";
import { Link as LinkTo } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import FileUploadServices from "../../services/fileUploadService";
import UserService from "../../services/usersService";
import ToasterMessageComponent from "../common/toaster";
import ButtonLoadderComponent from "../common/loadder/buttonloadder";
import ComponentLoadderComponent from "../common/loadder/componentloadder";
import { connect } from "react-redux";
import * as UserAction from "../../Redux/Action/userAction";
import GlobalSettingApiServices from "../../services/globalSettingService";
import * as globalSettingAction from "../../Redux/Action/globalSettingAction";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: 25,
  },
  fileUloadButtonsContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
  },
  icon: {
    marginRight: theme.spacing(0.5),
    marginBottom: -3,
    width: 20,
    height: 20,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100%",
    margin: 0,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  errorSpanMsg: {
    color: "red",
  },
  button: {
    margin: theme.spacing(1),
  },
  removeDeleteFileIcon: {
    color: "red",
    cursor: "pointer",
  },
  uploadFileContainer: {
    display: "inline-flex",
  },
  importUserFileContainer: {
    border: "3px solid #3f51b5",
    borderColor: "#3f51b5 !important",
    backgroundColor: "#ffffff",
    marginTop: 10,
  },
  dropzone: {
    width: "auto !important",
    border: "2px solid #86a9d7",
    margin: "12px !important",
    backgroundColor: "#ffffff !important",
  },
  fileUploadParagraph: {
    textAlign: "center",
  },
  fileuploadcontainer: {
    display: "flex",
    justifyContent: "center",
  },
}));

var excelDownladFileUrl =
  "https://ssapstorageqa.blob.core.windows.net/ssapstorageqa/Sample_bulk_upload.xlsx";

function ImportUsers(props) {
  const classes = useStyles();
  const GlobalSettingApi = new GlobalSettingApiServices();
  const apiCallForFileUpload = new FileUploadServices();
  const apiCallForUser = new UserService();
  const [componentLoadder, setcomponentLoadder] = useState(true);
  const [showLoadder, setshowLoadder] = useState(false);
  const [stateSnackbar, setStateSnackbar] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterServerity, settoasterServerity] = useState("");
  const [fileFormat, setfileFormat] = useState();
  const [toasterErrorMessageType, settoasterErrorMessageType] =
    useState("array");
  const [myFiles, setMyFiles] = useState([]);
  const onDrop = useCallback((acceptedFiles) => {
    setMyFiles(acceptedFiles);
  });
  // const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
  //   onDrop,
  //   noClick: true,
  //   noKeyboard: true,
  // });

  const files = myFiles.map((file) => (
    <Grid item xs={12} className={classes.uploadFileContainer}>
      <Grid key={file.path}>
        {file.path} - {file.size} bytes
      </Grid>
      <Grid item>
        <DeleteIcon
          className={classes.removeDeleteFileIcon}
          onClick={removeFile}
        />
      </Grid>
    </Grid>
  ));

  useEffect(() => {
    GlobalSettingApi.getLoadGlobalSetting()
      .then((globalSettings) => {
        setfileFormat(globalSettings.fileFormatToImportUsers);
        setcomponentLoadder(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function removeFile() {
    setMyFiles([]);
  }
  function handleredirect() {
    props.history.push("/users/import-users-history");
  }

  function UserbulkUpload() {
    const data = new FormData();
    settoasterServerity("");
    settoasterErrorMessageType("");
    data.append("file", myFiles[0]);
    apiCallForFileUpload
      .fileUpload(data)
      .then((result) => {
        var uploadFileNew = result[0].uplodedFileName;
        var generateFileNew = result[0].generatedFileName;
        var newData = new Object();
        newData.uploadedFileName = uploadFileNew;
        newData.generatedFileName = generateFileNew;
        var finalData = JSON.stringify(newData);
        apiCallForUser
          .bulkUserFileUpload(finalData)
          .then((result) => {
            setStateSnackbar(true);
            setToasterMessage("Imported users details.");
            settoasterServerity("success");
            setTimeout(() => {
              props.history.push("/users/import-users-history");
            }, 3000);
          })
          .catch((err) => {
            setStateSnackbar(true);
            setToasterMessage(err.data.errors);
            settoasterServerity("error");
          });
      })
      .catch((err) => {
        setToasterMessage(err.data.errors);
        settoasterServerity("error");
        setStateSnackbar(true);
      });
  }

  return (
    <div className="innerpage-container">
      <Breadcrumbs aria-label="breadcrumb" className="global-breadcrumb">
        <LinkTo
          color="inherit"
          href="#"
          to={`/home/dashboard`}
          className="inactive"
        >
          Home
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          to={`/users/allusers`}
          className="inactive"
        >
          Users
        </LinkTo>
        <LinkTo
          color="textPrimary"
          href="#"
          aria-current="page"
          className="active"
        >
          Import users
        </LinkTo>
      </Breadcrumbs>
      {componentLoadder ? (
        <ComponentLoadderComponent />
      ) : (
        <Paper className={`main-paper import-user-paper`}>
          <ValidatorForm className={`global-form`} onSubmit={UserbulkUpload}>
            <Grid item sm={12}>
              <Grid item sm={9} required>
                <label>
                  Step1:<a href={excelDownladFileUrl}>Download</a> excel File
                  Template. Skip if already downloaded.
                </label>
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.importUserFileContainer}>
              <Dropzone
                accept={fileFormat ? "." + fileFormat : ".xls"}
                onDrop={onDrop}
                noClick={true}
                noKeyboard={true}
              >
                {({ getRootProps, getInputProps, open }) => {
                  return (
                    <div {...getRootProps({ className: classes.dropzone })}>
                      <input {...getInputProps()} />
                      <p className={classes.fileUploadParagraph}>
                        upload Drag and drop or browse{" "}
                        {fileFormat ? fileFormat : "xls"} file to upload
                      </p>
                      <div className={`fileuploadcontainer`}>
                        <Button
                          variant="contained"
                          onClick={open}
                          className={`global-info-btn`}
                          startIcon={<CloudUploadIcon />}
                        >
                          Browse
                        </Button>
                      </div>
                    </div>
                  );
                }}
              </Dropzone>
              <div>
                <aside>
                  {files.length > 0 ? (
                    <div>
                      {/* <h4>Files</h4> */}
                      <ul>{files}</ul>
                    </div>
                  ) : null}
                </aside>
              </div>
            </Grid>
            <Grid container>
              <Grid item xs={12} className={`inner-table-buttons`}>
                <div className={`form-buttons-container`}>
                  <Button
                    variant="contained"
                    type="submit"
                    className="global-submit-btn"
                    disabled={showLoadder}
                  >
                    {showLoadder ? <ButtonLoadderComponent /> : "Submit"}
                  </Button>
                  <Button
                    variant="contained"
                    type="reset"
                    className="global-cancel-btn"
                    onClick={handleredirect}
                  >
                    Cancel
                  </Button>
                </div>
              </Grid>
            </Grid>
          </ValidatorForm>
        </Paper>
      )}
      <ToasterMessageComponent
        stateSnackbar={stateSnackbar}
        setStateSnackbar={setStateSnackbar}
        toasterMessage={toasterMessage}
        toasterServerity={toasterServerity}
        toasterErrorMessageType={toasterErrorMessageType}
      />
    </div>
  );
}

export default ImportUsers;

// ImportUsers.propTypes = {
//   loadGlobalSettingWithoutAPICall: PropTypes.func.isRequired,
// };

// function mapStateToProps(state, ownProps) {
//   return {
//     UserData: state.user,
//     loadGlobalSettingsData: state.loadGlobalSettingsData,
//   };
// }

// const mapDispatchToProps = {
//   loadGlobalSettingWithoutAPICall:
//     globalSettingAction.loadGlobalSettingWithoutAPICall,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(ImportUsers);
