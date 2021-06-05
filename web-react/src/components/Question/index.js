import React, { useState, useEffect } from "react";

import * as Queries from "../../queries";
import * as Mutations from "../../mutations";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

import cx from "classnames";
import { Typography, Modal, Input } from "antd";
import styles from "./styles/Question.module.scss";
import { Navbar, Button, FullScreenSpinner } from "../Core";

const { Title } = Typography;
const { TextArea } = Input;

function QuestionPost(props) {
  const questionId = props.match.params.id;

  const [state, setState] = useState({
    error: false,
    newAnswer: "",
    question: null,
    loading: false,
    notFound: false,
    modalVisible: false,
    modalLoading: false,
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
  const [createAnswer] = useMutation(Mutations.CREATE_ANSWER);
  useEffect(() => {
    // setState((state) => ({ ...state, loading: true }));
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
      setState((state) => ({
        ...state,
        modalVisible: true,
      }));
    } else {
      props.history.push("/signup");
    }
  };

  const handleSubmitAnswer = async () => {
    if (state.newAnswer === "") {
      return;
    }

    setState((state) => ({
      ...state,
      modalLoading: true,
    }));

    const createAnswerResult = await createAnswer({
      variables: {
        questionId: questionId,
        text: state.newAnswer,
      },
    });

    if (createAnswerResult.data.createAnswer.status !== "OK") {
      // Error occurred. Handle error state later
      setState((state) => ({
        ...state,
        modalLoading: false,
      }));
    } else {
      setState((state) => ({
        ...state,
        loading: true,
      }));
      props.history.push("/home");
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
      <Modal
        title="Add an Answer"
        visible={state.modalVisible}
        onOk={() => handleSubmitAnswer()}
        confirmLoading={state.modalLoading}
        onCancel={() =>
          setState((state) => ({
            ...state,
            modalVisible: false,
            modalLoading: false,
          }))
        }
        cancelButtonProps={{
          disabled: state.modalLoading,
          className: cx(styles.answerModalCancelButton),
        }}
        okButtonProps={{
          className: cx(styles.answerModalOkButton),
        }}
        cancelText="Back"
        closable={!state.modalLoading}
        maskClosable={!state.modalLoading}
      >
        <Title level={4} className={cx(styles.answerModalBodyHeading)}>
          {state.question.title}
        </Title>
        <TextArea
          value={state.newAnswer}
          onChange={(e) =>
            setState((state) => ({
              ...state,
              newAnswer: e.target.value,
            }))
          }
          rows={6}
          className={cx(styles.answerModalBodyInput)}
          placeholder="Write an answer that is correct, to the point and free of jargon. Back it up with numbers, statistics and facts wherever needed..."
        />
      </Modal>
    </>
  );
}

export default QuestionPost;
