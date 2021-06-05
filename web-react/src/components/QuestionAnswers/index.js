import React, { useState, useEffect } from "react";

import * as Queries from "../../queries";
import * as Mutations from "../../mutations";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";

import cx from "classnames";
import { Typography, Modal, Input } from "antd";
import styles from "./styles/QuestionAnswers.module.scss";
import { Navbar, Button, FullScreenSpinner } from "../Core";

const { Title, Text } = Typography;
const { TextArea } = Input;

function QuestionPostAnswers(props) {
  const answersResult = useQuery(Queries.GET_QUESTION_ANSWERS, {
    variables: {
      questionId: props.params.questionId,
    },
  });
  if (answersResult.loading) {
    return null;
  }

  return (
    <div className={cx(styles.answers)}>
      <Title
        level={2}
        style={{
          marginTop: "32px",
          fontWeight: 500,
        }}
      >
        {answersResult?.data?.getQuestionAnswers?.length} Answers
      </Title>
      {answersResult?.data?.getQuestionAnswers?.map((answer) => (
        <div className={cx(styles.answersItem)} key={answer._id}>
          <div className={cx(styles.answersItemContent)}>
            <div className={cx(styles.votesWrapper)}>
              <Title level={2} type="secondary">
                {answer.votes ? answer.votes : 0}
              </Title>
              <Text type="secondary">Upvotes</Text>
            </div>
            <p>{answer.text}</p>
          </div>
          <div className={cx(styles.answersItemMetadata)}>
            {/* TODO Answer edited on */}
            <div className={cx(styles.authorWrapper)}>
              <p>answered {new Date(answer.createdOn).toLocaleString()}</p>
              <p>{answer.postedBy.name}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default QuestionPostAnswers;
