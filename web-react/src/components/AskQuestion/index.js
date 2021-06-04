import React, { useState } from "react";
import * as Queries from "../../queries";
import * as Mutations from "../../mutations";
import { useQuery, useMutation } from "@apollo/client";
import { Typography, Select, Input as AntInput, Alert } from "antd";

import { Navbar, Button, Input, FullScreenSpinner } from "../Core";

import cx from "classnames";
import styles from "./styles/AskQuestion.module.scss";

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = AntInput;

function AskQuestion(props) {
  const spacesResult = useQuery(Queries.GET_SPACES);
  const [publishPost] = useMutation(Mutations.PUBLISH_POST);

  const [formData, setFormData] = useState({
    question: "",
    description: "",
    spaces: [],
  });

  const [state, setState] = useState({
    loading: false,
    alertMessage: "Nothing to show",
    showAlert: false,
    alertType: "error",
  });

  const handleQuestionChange = (question) => {
    setFormData((form) => ({
      ...form,
      question: question,
    }));
  };

  const handleDescriptionChange = (description) => {
    setFormData((form) => ({
      ...form,
      description: description,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationResult = validateData();

    try {
      if (validationResult.length !== 0) {
        // Errors are present
        setState((state) => ({
          ...state,
          loading: false,
          showAlert: true,
          alertMessage: validationResult,
          alertType: "error",
        }));
        return;
      }
    } catch (err) {
      setState((state) => ({
        ...state,
        loading: false,
        showAlert: true,
        alertMessage: "An error occurred!",
        alertType: "error",
      }));
      return;
    }

    setState((state) => ({
      ...state,
      showAlert: true,
      alertType: "success",
      alertMessage: "Question posted successfully!",
    }));
    const [questionInput, descriptionInput, _] = event.target;

    try {
      const publishPostResult = await publishPost({
        variables: {
          title: questionInput.value,
          text: descriptionInput.value,
          spaceIds: formData.spaces,
        },
      });

      if (publishPostResult.data.publishPost.code !== "OK") {
        throw Error(publishPostResult.data.publishPost.error.message);
      }

      // Post created successfully

      setState((state) => ({
        ...state,
        showAlert: true,
        alertType: "success",
        alertMessage: "Question posted successfully!",
      }));

      setTimeout(() => {
        props.history.push("/home");
      }, 1000);
    } catch (err) {
      console.log(err);
      setState((state) => ({
        ...state,
        loading: false,
        showAlert: false,
        alertMessage: "An error occurred. Could not post your question!",
      }));
    }
  };

  const handleSpacesChange = (selectedSpaces) => {
    setFormData((form) => ({
      ...form,
      spaces: selectedSpaces,
    }));
  };

  const validateData = () => {
    if (formData.question === "") {
      return "Question title is a required field";
    }
    if (formData.description === "") {
      return "Question description is a required field";
    }
    if (formData.spaces.length === 0) {
      return "Select at least 1 space for the question";
    }
    return "";
  };

  if (spacesResult.loading) {
    return <FullScreenSpinner />;
  }

  return (
    <>
      <Navbar showLogoutOption history={props.history} />
      <div className="globalContainer">
        <div className={cx(styles.headerWrapper)}>
          <Title>Ask a Question</Title>
        </div>
        <div className={cx(styles.contentWrapper)}>
          <div className={cx(styles.contentContainer)}>
            <form onSubmit={(e) => handleSubmit(e)}>
              <Title level={3} className={cx(styles.sectionTitle)}>
                Title
              </Title>
              <Text className={cx(styles.sectionDescription)}>
                Be specific and imagine you’re asking a question to another
                person
              </Text>
              <Input
                size="large"
                type="text"
                name="question"
                required
                placeholder="e.g. Is there an R function finding the index of an element in a vector?"
                onChange={(e) => handleQuestionChange(e.target.value)}
                value={formData.question}
                style={{
                  marginTop: "8px",
                }}
                disabled={state.loading}
              />

              <Title level={3} className={cx(styles.sectionTitle)}>
                Body
              </Title>
              <Text className={cx(styles.sectionDescription)}>
                Include all the information someone would need to answer your
                question
              </Text>
              <TextArea
                size="large"
                type="text"
                name="description"
                required
                onChange={(e) => handleDescriptionChange(e.target.value)}
                value={formData.description}
                style={{
                  height: "320px",
                  marginTop: "8px",
                  textAlign: "start",
                }}
                disabled={state.loading}
                className={cx(styles.sectionInput)}
              />

              <Title level={3} className={cx(styles.sectionTitle)}>
                Spaces
              </Title>
              <Text className={cx(styles.sectionDescription)}>
                Add up to 5 spaces to describe what your question is about
              </Text>
              <Select
                defaultValue={[]}
                value={formData.spaces}
                menuItemSelectedIcon
                mode="multiple"
                placeholder="e.g. Technology, Business, Food, Travel"
                name="spaces"
                style={{
                  width: "100%",
                  marginTop: "8px",
                }}
                required
                onChange={(value) => handleSpacesChange(value)}
                optionFilterProp="value"
                disabled={state.loading}
              >
                {spacesResult.data.spaces.map((space) => (
                  <Option key={space._id} value={space._id}>
                    {space.name}
                  </Option>
                ))}
              </Select>
              <Button
                htmlType="submit"
                shape="round"
                color="primary"
                style={{
                  marginTop: "40px",
                }}
                disabled={state.loading}
              >
                Publish Question
              </Button>
              <br />
              <p className={cx(styles.submitInstructions)}>
                This will publish your questions and make it live
              </p>
            </form>
            {state.showAlert && (
              <Alert
                message={state.alertMessage}
                onClose={() =>
                  setState((prev) => ({
                    ...prev,
                    showAlert: false,
                  }))
                }
                type={state.alertType}
                showIcon
                closable
                style={{ marginTop: "40px" }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AskQuestion;
