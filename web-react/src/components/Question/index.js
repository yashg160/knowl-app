import React, { useState, useEffect } from "react";

import * as Queries from "../../queries";
import * as Mutations from "../../mutations";
import { useLazyQuery, useQuery } from "@apollo/client";

import cx from "classnames";
import { Typography } from "antd";
import styles from "./styles/Question.module.scss";
import { Navbar, Button, Input, FullScreenSpinner } from "../Core";

const { Title } = Typography;

function QuestionPost(props) {
  const questionId = props.match.params.id;

  const [state, setState] = useState({
    error: false,
    question: null,
    loading: false,
    notFound: false,
  });

  const [getQuestion] = useLazyQuery(Queries.GET_QUESTION, {
    onCompleted: (data) => {
      if (data.posts && data.posts.length !== 0) {
        // Question found
        setState((state) => ({
          ...state,
          question: data.posts[0],
          loading: false,
        }));
      } else {
        // Question not found
        setState((state) => ({
          ...state,
          notFound: true,
        }));
      }
    },
    onError: (err) => {
      setState((prev) => ({
        ...prev,
        error: true,
      }));
    },
    variables: {
      _id: questionId,
    },
  });

  useEffect(() => {
    setState((state) => ({ ...state, loading: true }));
    getQuestion();
  }, []);

  const handleAskQuestionClick = () => {
    const token = localStorage.getItem("TOKEN");

    if (token) {
      props.history.push("/aksQuestion");
    } else {
      props.history.push("/signup");
    }
  };

  const handleAnswerQuestionClick = () => {
    const token = localStorage.getItem("TOKEN");

    if (token) {
      // props.history.push('/aksQuestion');
      // TODO Handle answering
    } else {
      props.history.push("/signup");
    }
  };

  if (state.loading || !state.question) {
    return <FullScreenSpinner />;
  }

  // Loading complete
  return (
    <>
      <Navbar />
      <div className="globalContainer">
        <div className={cx(styles.headerWrapper)}>
          <Title>{state.question.title}</Title>
          <div className={cx(styles.actionsWrapper)}>
            <Button
              color="primary"
              shape="round"
              disabled={state.loading}
              onClick={() => handleAskQuestionClick()}
            >
              Ask Question
            </Button>

            <Button
              color="secondary"
              shape="round"
              disabled={state.loading}
              onClick={() => handleAnswerQuestionClick()}
            >
              Answer
            </Button>
          </div>
        </div>
        <div className={cx(styles.contentWrapper)}>
          <Title
            level={3}
            style={{
              marginTop: "32px",
              fontWeight: 500,
            }}
          >
            Most voted answer
          </Title>
        </div>
      </div>
    </>
  );
}

export default QuestionPost;
