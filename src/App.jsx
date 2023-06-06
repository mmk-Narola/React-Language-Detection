import React, { useState, useEffect } from "react";
import "./App.css";
import AxiosInstance from "./configs/http-config";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

let bodyParameters = {};

function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("");
  const [show, setShow] = useState(false);
  const [showAlter, setShowAlter] = useState(false);
  const [recentSearch, setRecentSearch] = useState([]);

  const onChange = (e) => {
    setText(e.target.value);
  };

  // detect Language and Language Code
  const DetectLanguage = async (bodyParameters) => {
    const response = await AxiosInstance.post("/detect", bodyParameters);
    const getLanguageCode = await AxiosInstance.get("/languages");
    const res = response.data.data.detections;
    const code = getLanguageCode.data;

    let langDetect = res.filter((ele) => ele.isReliable === true);
    let setter = null;

    for (let index = 0; index < code.length; index++) {
      if (code[index].code === langDetect[0]?.language) {
        setter = code[index].name;
        break;
      } else {
        setter = "Language Not Detect";
      }
    }
    setLanguage(setter);
  };

  //Store in and SessionStorage
  const dataStorage = (inputText) => {
    // store in  session storage
    const recentSearch = sessionStorage.getItem("recentSearch")
      ? JSON.parse(sessionStorage.getItem("recentSearch"))
      : [];
    const indexOf = recentSearch.map((e) => e.value).indexOf(inputText);
    if (indexOf === -1) {
      recentSearch.push({ value: inputText });
      setRecentSearch(recentSearch);
      sessionStorage.setItem("recentSearch", JSON.stringify(recentSearch));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let booleanValue = null;
    if (text) {
      bodyParameters = {
        q: text.trim(),
      };
      booleanValue = false;
      DetectLanguage(bodyParameters);
      // store in  session storage
      dataStorage(text);
    } else {
      booleanValue = true;
    }

    setShowAlter(booleanValue);
  };

  useEffect(() => {
    const recentSearch = sessionStorage.getItem("recentSearch")
      ? JSON.parse(sessionStorage.getItem("recentSearch"))
      : [];
    setRecentSearch(recentSearch);
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-8 mt-4">
          {showAlter && (
            <>
              <Alert
                variant="danger"
                onClose={() => {
                  setShow(false);
                  setShowAlter(false);
                }}
                dismissible
              >
                Please Enter Text TextBox
              </Alert>
            </>
          )}
          <label className="form-label mt-4">
            Language Detection <span className="text-danger">*</span>
          </label>
          <Form.Control
            type="text"
            placeholder="Enter Text"
            name="text"
            value={text}
            onChange={onChange}
          />
        </div>
        <div className="mt-3">
          <div className="d-flex gap-2 align-items-center">
            <button
              className="btn btn-primary px-4"
              type="submit"
              onClick={handleSubmit}
            >
              Detect Language
            </button>
            <button
              className="btn btn-secondary px-4"
              type="button"
              onClick={() => {
                setText("");
                setLanguage("");
              }}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="col-8 mt-3">
          <FloatingLabel controlId="floatingTextarea2" label="Loading...">
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              style={{ height: "100px" }}
              defaultValue={language && language == 0 ? "Loading..." : language}
            />
          </FloatingLabel>
        </div>
        <div className="col-8">
          <label className="form-label mt-4">Recent Search </label>
          <div>
            {recentSearch &&
              recentSearch.map((val, index) => (
                <React.Fragment key={index}>
                  <span
                    className="tag tag-sm"
                    onClick={() => {
                      console.log("Value", val);
                      setText(val.value);
                    }}
                  >
                    {val.value}
                  </span>{" "}
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

// axios
//   .post("https://ws.detectlanguage.com/0.2/detect", bodyParameters, config)
//   .then((res) => {
//     console.log(res.data);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// AxiosInstance.get("https://ws.detectlanguage.com/0.2/languages")
//   .then((res) => {
//     console.log(res.data);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// const bodyParameters = {
//   q: text.trim(),
// };
// res.map((eleLan) => {
//   if (eleLan.isReliable === true) {
//     let name = code.find((ele) => {
//       if (ele.code === eleLan.language) {
//         console.log(ele.name);
//         return ele.name;
//       }
//     });
//     console.log(name.name);
//     setLanguage(name.name);
//   }
// });
// const response = await AxiosInstance.post("/detect", bodyParameters);
// const getLanguageCode = await AxiosInstance.get("/languages");
// const res = response.data.data.detections;
// const code = getLanguageCode.data;

// let langDetect = res.filter((ele) => ele.isReliable === true);
// let setter = null;

// for (let index = 0; index < code.length; index++) {
//   if (code[index].code === langDetect[0]?.language) {
//     console.log(code[index].name);
//     setter = code[index].name;
//     break;
//   } else {
//     setter = "Language Not Detect";
//   }
// }
// setLanguage(setter);
// const recentSearch = sessionStorage.getItem("recentSearch")
//   ? JSON.parse(sessionStorage.getItem("recentSearch"))
//   : [];

// const indexOf = recentSearch.map((e) => e.value).indexOf(text);
// if (indexOf === -1) {
//   recentSearch.push({ value: text });
//   setRecentSearch(recentSearch);
//   sessionStorage.setItem("recentSearch", JSON.stringify(recentSearch));
// }
