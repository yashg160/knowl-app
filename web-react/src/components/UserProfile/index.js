import React, { useState, useEffect } from "react";
import { decode } from "jsonwebtoken";
import { useQuery, useMutation } from "@apollo/client";
import cx from "classnames";

import { Typography, Modal, Input as AntInput } from "antd";

const { Text, Title } = Typography;
const { TextArea } = AntInput;

import * as Queries from "../../queries";

import { Navbar, Button, Input, FullScreenSpinner } from "../Core";
import { AiOutlineUser, AiOutlineMail } from "react-icons/ai";
import * as Mutations from "../../mutations";

import styles from "./styles/Profile.module.scss";

function UserProfile(props) {
  const [updateUser] = useMutation(Mutations.UPDATE_PROFILE);
  const [updateQuestion] = useMutation(Mutations.UPDATE_QUESTION);
  const [updateAnswer] = useMutation(Mutations.UPDATE_ANSWER);

  const userProfileResult = useQuery(Queries.GET_USER_PROFILE, {
    variables: {
      userId: props.match.params.userId,
    },
  });

  const [state, setState] = useState({
    userFound: false,
    showError: false,
    errorMessage: "",
    allowEditProfile: false,
    loading: false,
    selectedSideItem: "EDIT_PROFILE",
    editQuestionModalVisible: false,
    editQuestionModalLoading: false,
    editQuestionId: "",
    editQuestionTitle: "",
    editQuestionText: "",
    editAnswerModalVisible: false,
    editAnswerModalLoading: false,
    editAnswerId: "",
    editAnswerText: "",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!userProfileResult.loading) {
      setUpEditProfile();
    }
  }, [userProfileResult.loading]);

  const setUpEditProfile = () => {
    const token = localStorage.getItem("TOKEN");
    let loggedInUserData = {};

    if (token) {
      loggedInUserData = decode(token, process.env.REACT_APP_JWT_SECRET);
      console.log(loggedInUserData);
    }

    if (userProfileResult.error) {
      // Error occurred
    } else {
      if (userProfileResult.data.getUserProfile !== null) {
        // User with the id in the path was found.
        setState((state) => ({
          ...state,
          userFound: true,
        }));

        setName(userProfileResult.data.getUserProfile.name);
        setEmail(userProfileResult.data.getUserProfile.email);

        if (
          loggedInUserData._id === userProfileResult.data.getUserProfile._id
        ) {
          // Same user as being viewed
          setState((state) => ({
            ...state,
            allowEditProfile: true,
          }));
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setState((state) => ({
      ...state,
      loading: true,
    }));

    try {
      await updateUser({
        variables: {
          name: name,
          email: email,
        },
      });

      setState((state) => ({
        ...state,
        loading: false,
      }));
    } catch (err) {
      setState((state) => ({
        ...state,
        loading: false,
        showError: true,
        errorMessage: "An error occurred. Could not update your profile.",
      }));
    }
  };

  const handleSubmitEditQuestion = async () => {
    setState((state) => ({
      ...state,
      editQuestionModalLoading: true,
    }));

    try {
      await updateQuestion({
        variables: {
          questionId: state.editQuestionId,
          title: state.editQuestionTitle,
          text: state.editQuestionText,
        },
      });

      setState((state) => ({
        ...state,
        editQuestionModalLoading: false,
      }));

      location.reload();
    } catch (err) {
      console.log(err);
      setState((state) => ({
        ...state,
        editQuestionModalLoading: false,
        showError: true,
        errorMessage: "An error occurred. Could not update your profile.",
      }));
    }
  };

  const handleSubmitEditAnswer = async () => {
    setState((state) => ({
      ...state,
      editAnswerModalLoading: true,
    }));

    try {
      await updateAnswer({
        variables: {
          answerId: state.editAnswerId,
          text: state.editAnswerText,
        },
      });

      setState((state) => ({
        ...state,
        editAnswerModalLoading: false,
      }));

      location.reload();
    } catch (err) {
      console.log(err);
      setState((state) => ({
        ...state,
        editAnswerModalLoading: false,
        showError: true,
        errorMessage: "An error occurred. Could not update your profile.",
      }));
    }
  };

  if (userProfileResult.loading) {
    return <FullScreenSpinner />;
  }

  return (
    <>
      <Navbar showLogoutOption history={props.history} />
      <div className="globalContainer">
        <div className={cx(styles.wrapper)}>
          <div className={cx(styles.sidePanel)}>
            <div
              className={cx(styles.selectItem, {
                [styles.selected]: state.selectedSideItem === "EDIT_PROFILE",
              })}
              onClick={() =>
                setState((state) => ({
                  ...state,
                  selectedSideItem: "EDIT_PROFILE",
                }))
              }
            >
              <Text style={{ fontSize: "16px" }}>Edit Profile</Text>
            </div>
            <div
              className={cx(styles.selectItem, {
                [styles.selected]:
                  state.selectedSideItem === "POSTED_QUESTIONS",
              })}
              onClick={() =>
                setState((state) => ({
                  ...state,
                  selectedSideItem: "POSTED_QUESTIONS",
                }))
              }
            >
              <Text style={{ fontSize: "16px" }}>Questions</Text>
            </div>

            <div
              className={cx(styles.selectItem, {
                [styles.selected]: state.selectedSideItem === "POSTED_ANSWERS",
              })}
              onClick={() =>
                setState((state) => ({
                  ...state,
                  selectedSideItem: "POSTED_ANSWERS",
                }))
              }
            >
              <Text style={{ fontSize: "16px" }}>Answers</Text>
            </div>

            <div
              className={cx(styles.selectItem, {
                [styles.selected]: state.selectedSideItem === "SPACES",
              })}
              onClick={() => {
                props.history.push("/selectSpaces?ref=USER_PROFILE");
                setState((state) => ({
                  ...state,
                  selectedSideItem: "SPACES",
                }));
              }}
            >
              <Text style={{ fontSize: "16px" }}>Spaces</Text>
            </div>
          </div>
          <div className={cx(styles.mainContent)}>
            {state.selectedSideItem === "EDIT_PROFILE" && (
              <>
                <Title level={2} style={{ fontWeight: 500 }}>
                  Update Your Profile
                </Title>
                <form
                  onSubmit={(e) => handleSubmit(e)}
                  className={cx(styles.inputForm)}
                  style={{ marginTop: "40px" }}
                >
                  <Input
                    size="large"
                    type="text"
                    name="name"
                    required
                    placeholder="Name"
                    value={name}
                    prefix={<AiOutlineUser />}
                    onChange={(e) => {
                      setName(e.target.value);
                      setState((prev) => ({
                        ...prev,
                        showAlert: false,
                      }));
                    }}
                  />

                  <Input
                    size="large"
                    type="text"
                    name="email"
                    required
                    placeholder="Email"
                    value={email}
                    prefix={<AiOutlineMail />}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setState((prev) => ({
                        ...prev,
                        showAlert: false,
                      }));
                    }}
                    style={{ marginTop: "20px" }}
                  />

                  <Button
                    htmlType="submit"
                    color="primary"
                    shape="round"
                    disabled={state.loading}
                    style={{ marginTop: "32px" }}
                  >
                    Update Profile
                  </Button>
                </form>
              </>
            )}

            {state.selectedSideItem === "POSTED_QUESTIONS" && (
              <>
                <Title level={2} style={{ fontWeight: 500 }}>
                  Posted Questions
                </Title>

                <div className={cx(styles.postDataContent)}>
                  <div className={cx(styles.dataItem)}>
                    <Text style={{ fontSize: "24px" }}>
                      {userProfileResult.data.getUserProfile.numPosts} posted
                      till date
                    </Text>
                  </div>
                </div>

                <Title level={3} style={{ fontWeight: 500 }}></Title>
                <div className={cx(styles.userPosts)}>
                  {userProfileResult.data.getUserProfile.posts.map(
                    (post, index) => (
                      <div
                        key={post._id}
                        className={cx(styles.post)}
                        onClick={() =>
                          setState((state) => ({
                            ...state,
                            editQuestionModalVisible: true,
                            editQuestionId: post._id,
                            editQuestionTitle: post.title,
                            editQuestionText: post.text,
                          }))
                        }
                      >
                        <Text className={cx(styles.postText)}>
                          {post.title}
                        </Text>
                      </div>
                    )
                  )}
                </div>
              </>
            )}

            {state.selectedSideItem === "POSTED_ANSWERS" && (
              <>
                <Title level={2} style={{ fontWeight: 500 }}>
                  Your Answers
                </Title>

                <div className={cx(styles.postDataContent)}>
                  <div className={cx(styles.dataItem)}>
                    <Text style={{ fontSize: "24px" }}>
                      {userProfileResult.data.getUserProfile.numAnswers} posted
                      till date
                    </Text>
                  </div>
                </div>

                <Title level={3} style={{ fontWeight: 500 }}></Title>
                <div className={cx(styles.userPosts)}>
                  {userProfileResult.data.getUserProfile.answers.map(
                    (answer, index) => (
                      <div
                        key={answer._id}
                        className={cx(styles.post)}
                        onClick={() =>
                          setState((state) => ({
                            ...state,
                            editAnswerModalVisible: true,
                            editAnswerId: answer._id,
                            editAnswerText: answer.text,
                          }))
                        }
                      >
                        {answer.text?.length > 150 ? (
                          <Text className={cx(styles.postText)}>
                            {`${answer.text.substring(0, 200)}...`}
                          </Text>
                        ) : (
                          <Text className={cx(styles.postText)}>
                            {answer.text}
                          </Text>
                        )}
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Modal
        title="Edit this question"
        visible={state.editQuestionModalVisible}
        onOk={() => handleSubmitEditQuestion()}
        confirmLoading={state.editQuestionModalLoading}
        onCancel={() =>
          setState((state) => ({
            ...state,
            editQuestionModalVisible: false,
            editQuestionModalLoading: false,
          }))
        }
        cancelButtonProps={{
          disabled: state.editQuestionModalLoading,
          className: cx(styles.questionModalCancelButton),
        }}
        okButtonProps={{
          className: cx(styles.questionModalOkButton),
        }}
        cancelText="Back"
        closable={!state.editQuestionModalLoading}
        maskClosable={!state.editQuestionModalLoading}
      >
        <TextArea
          value={state.editQuestionTitle}
          onChange={(e) => {
            setState((state) => ({
              ...state,
              editQuestionTitle: e.target.value,
            }));
          }}
          rows={5}
          className={cx(styles.questionModalBodyInput)}
          placeholder="Edit this question....Do not submit an empty value."
        />
        <TextArea
          value={state.editQuestionText}
          onChange={(e) =>
            setState((state) => ({
              ...state,
              editQuestionText: e.target.value,
            }))
          }
          rows={10}
          className={cx(styles.questionModalBodyInput)}
          placeholder="Edit this question....Do not submit an empty value."
        />
      </Modal>

      <Modal
        title="Edit this answer post"
        visible={state.editAnswerModalVisible}
        onOk={() => handleSubmitEditAnswer()}
        confirmLoading={state.editAnswerModalLoading}
        onCancel={() =>
          setState((state) => ({
            ...state,
            editAnswerModalVisible: false,
            editAnswerModalLoading: false,
          }))
        }
        cancelButtonProps={{
          disabled: state.editAnswerModalLoading,
          className: cx(styles.questionModalCancelButton),
        }}
        okButtonProps={{
          className: cx(styles.questionModalOkButton),
        }}
        cancelText="Back"
        closable={!state.editAnswerModalLoading}
        maskClosable={!state.editAnswerModalLoading}
      >
        <TextArea
          value={state.editAnswerText}
          onChange={(e) =>
            setState((state) => ({
              ...state,
              editAnswerText: e.target.value,
            }))
          }
          rows={10}
          className={cx(styles.questionModalBodyInput)}
          placeholder="Edit this answer....Do not submit an empty value."
        />
      </Modal>
    </>
  );
}

export default UserProfile;
