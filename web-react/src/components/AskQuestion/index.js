import React, { useState, useEffect } from "react";
import * as Queries from "../../queries";
import { useQuery, useLazyQuery } from "@apollo/client";
import { Typography, Select } from "antd";

import { Navbar, Button, Input, FullScreenSpinner } from "../Core";

import cx from "classnames";
import styles from "./styles/AskQuestion.module.scss";

const { Title, Text } = Typography;
const { Option } = Select;

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

  const handleSpacesChange = (spaces) => {
    console.log("selected spaces", spaces);
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
            <form>
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
                className={cx(styles.sectionInput)}
              />

              <Title level={3} className={cx(styles.sectionTitle)}>
                Body
              </Title>
              <Text className={cx(styles.sectionDescription)}>
                Include all the information someone would need to answer your
                question
              </Text>
              <Input
                size="large"
                type="text"
                name="description"
                required
                onChange={(e) => handleDescriptionChange(e.target.value)}
                value={formData.description}
                style={{
                  height: "320px",
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
                menuItemSelectedIcon
                mode="multiple"
                // value={formData.spaces}
                placeholder="e.g. Technology, Business, Food, Travel"
                style={{
                  width: "100%",
                  marginTop: "8px",
                }}
                name="spaces"
                // onChange={(value) => handleSpacesChange(value)}
              >
                {spacesResult.data.spaces.map((space) => (
                  <Option key={space._id}>{space.name}</Option>
                ))}
              </Select>
              <Button
                type="submit"
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
