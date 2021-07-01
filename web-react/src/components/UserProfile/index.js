import React, { useState, useEffect } from "react";
import { decode } from "jsonwebtoken";
import { useQuery, useMutation } from "@apollo/client";
import cx from "classnames";

import { Typography, Row, Col, Alert } from "antd";

const { Text, Title } = Typography;

import * as Queries from "../../queries";

import { Navbar, Button, Input, FullScreenSpinner } from "../Core";
import { AiOutlineUser, AiOutlineMail } from "react-icons/ai";
import * as Mutations from "../../mutations";

import styles from "./styles/Profile.module.scss";

function UserProfile(props) {
  const [updateUser] = useMutation(Mutations.UPDATE_PROFILE);
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
                [styles.selected]: state.selectedSideItem === "POSTS",
              })}
              onClick={() =>
                setState((state) => ({
                  ...state,
                  selectedSideItem: "POSTS",
                }))
              }
            >
              <Text style={{ fontSize: "16px" }}>Posts</Text>
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

            {state.selectedSideItem === "POSTS" && (
              <>
                <Title level={2} style={{ fontWeight: 500 }}>
                  Your Posts
                </Title>

                <div className={cx(styles.postDataContent)}>
                  <div className={cx(styles.dataItem)}>
                    <Title level={3} style={{ fontWeight: 500 }}>
                      Questions
                    </Title>
                    <Text style={{ fontSize: "24px" }}>
                      {userProfileResult.data.getUserProfile.numPosts}
                    </Text>
                  </div>

                  <div className={cx(styles.dataItem)}>
                    <Title level={3} style={{ fontWeight: 500 }}>
                      Answers
                    </Title>
                    <Text style={{ fontSize: "24px" }}>
                      {userProfileResult.data.getUserProfile.numAnswers}
                    </Text>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
