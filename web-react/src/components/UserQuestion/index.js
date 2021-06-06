import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Typography } from "antd";

import { Navbar, Button, Input, FullScreenSpinner } from "../Core";

import * as Queries from "../../queries";

import cx from "classnames";
import styles from "./styles/UserQuestion.module.scss";

const { Title } = Typography;

function UserQuestionItem(props) {
  return (
    <div className={cx(styles.questions)}>
      <div className={cx(styles.questionsItemWrapper)}>
        <div className={cx(styles.questionsItemWrapperItem)}>
          <div className={cx(styles.votesWrapper)}>
            <h2>{props.question.votes ? props.question.votes : 0}</h2>
            <p>Upvotes</p>
          </div>
          <div className={cx(styles.answersWrapper)}>
            <h2>
              {props.question.answerCount ? props.question.answerCount : 0}
            </h2>
            <p>Answers</p>
          </div>
          <div className={cx(styles.questionsItemWrapperItemContentWrapper)}>
            <a href={`/questions/${props.question._id}`}>
              <Title level={3}>{props.question.title}</Title>
            </a>
            <div className={cx(styles.questionsItemMetadataWrapper)}>
              <div className={cx(styles.questionsItemTagsWrapper)}>
                {props.question.spaces.map((space) => (
                  <div className={cx(styles.tagItem)} key={space}>
                    <span>{space}</span>
                  </div>
                ))}
              </div>
              <div className={cx(styles.authorDataWrapper)}>
                <p className={cx(styles.authorDataWrapperName)}>
                  asked by {props.question.author.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserQuestionItem;
