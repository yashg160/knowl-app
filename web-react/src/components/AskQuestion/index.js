import React, { useState, useEffect } from "react";
import * as Queries from "../../queries";
import { useQuery, useLazyQuery } from "@apollo/client";
import { Typography, Select, Input as AntInput } from "antd";

import { Navbar, Button, Input, FullScreenSpinner } from "../Core";

import cx from "classnames";
import styles from "./styles/AskQuestion.module.scss";

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = AntInput;

function AskQuestion(props) {
  const spacesResult = useQuery(Queries.GET_SPACES);

  const [formData, setFormData] = useState({
    question: "",
    description: "",
    spaces: [],
  });
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (question) => {
    setFormData((state) => ({
      ...state,
      question: question,
    }));
  };

  const handleDescriptionChange = (description) => {
    setFormData((state) => ({
      ...state,
      description: description,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const [questionInput, descriptionInput, _] = event.target;
  };

  const handleSpacesChange = (selectedSpaces) => {
    setFormData((state) => ({
      ...state,
      spaces: selectedSpaces,
    }));
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
              >
                Publish Question
              </Button>
              <br />
              <p className={cx(styles.submitInstructions)}>
                This will publish your questions and make it live
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AskQuestion;
