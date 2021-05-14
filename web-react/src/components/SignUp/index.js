import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";

import { Navbar, Button, Input } from "../Core";
import { Typography, Row, Col, Alert } from "antd";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";

const { Text, Title } = Typography;

import cx from "classnames";
import styles from "./styles/SignUp.module.scss";

const ADD_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      user {
        name
      }
      error {
        message
      }
      operation
      code
      status
    }
  }
`;
const SIGN_IN_USER = gql`
  mutation SignInUser($email: String!, $password: String!) {
    signInUser(email: $email, password: $password) {
      user {
        name
      }
      error {
        message
      }
      operation
      code
      status
      token
    }
  }
`;

function SignUp(props) {
  const [createUser] = useMutation(ADD_USER);
  const [signInUser] = useMutation(SIGN_IN_USER);

  const [state, setState] = useState({
    loading: false,
    showAlert: false,
    alertMessage: "Nothing to show",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const [nameInput, emailInput, passwordInput] = e.target;

    // API call to create a new user
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
        showAlert: false,
      }));

      // Call the GQL API to create the user
      const signUpUserResult = await createUser({
        variables: {
          name: nameInput.value,
          email: emailInput.value,
          password: passwordInput.value,
        },
      });

      console.log("signUpUserResult", signUpUserResult);

      if (signUpUserResult.data.createUser.status !== "OK") {
        // An error occurred
        console.log(signUpUserResult.data.createUser.code);
        throw Error(signUpUserResult.data.createUser.error.message);
      }

      // Account was created, now sign the user in and get a jwt token
      // Call the GQL API to sign the user in
      const signInUserResult = await signInUser({
        variables: {
          email: emailInput.value,
          password: passwordInput.value,
        },
      });

      console.log("signInUserResult", signInUserResult);

      if (signInUserResult.data.signInUser.status !== "OK") {
        // An error occurred
        console.log(signInUserResult.data.signInUser.code);
        throw Error(signInUserResult.data.signInUser.error.message);
      }

      // Signed in successfully. Save token and proceed
      localStorage.setItem("TOKEN", signInUserResult.data.signInUser.token);

      // Move to the home screen
      props.history.push("/home");
    } catch (err) {
      console.error(err);
      setState((prev) => ({
        ...prev,
        loading: false,
        showAlert: true,
        alertMessage: err.message,
      }));
    }
  }

  return (
    <>
      <Navbar />
      <div className={cx(styles.container)}>
        <div className={cx(styles.welcomeImageContainer)}>
          <div className={cx(styles.welcomeImageOverlay)}></div>
        </div>
        <div className={cx(styles.registerFormContainer)}>
          <Row justify="center">
            <Col
              span={24}
              style={{
                marginTop: "48px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Title level={2} style={{ textAlign: "center", fontWeight: 500 }}>
                Create your account
              </Title>
              <Text style={{ textAlign: "center", fontSize: "1.414rem" }}>
                Explore the possibilities and expand your knowledge
              </Text>

              <form
                onSubmit={(e) => handleSubmit(e)}
                className={cx(styles.inputForm)}
                style={{ marginTop: "40px" }}
              >
                <Row justify="center">
                  <Col
                    span={24}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Input
                      size="large"
                      type="text"
                      name="name"
                      required
                      placeholder="Full Name"
                      prefix={<AiOutlineUser />}
                      onChange={() =>
                        setState((prev) => ({
                          ...prev,
                          showAlert: false,
                        }))
                      }
                    />
                    <Input
                      size="large"
                      type="email"
                      name="email"
                      required
                      placeholder="Email"
                      prefix={<AiOutlineMail />}
                      style={{ margin: "8px 0px" }}
                      onChange={() =>
                        setState((prev) => ({
                          ...prev,
                          showAlert: false,
                        }))
                      }
                    />
                    <Input
                      size="large"
                      type="password"
                      name="password"
                      required
                      placeholder="Password"
                      prefix={<AiOutlineLock />}
                      onChange={() =>
                        setState((prev) => ({
                          ...prev,
                          showAlert: false,
                        }))
                      }
                    />

                    <Button
                      htmlType="submit"
                      color="primary"
                      shape="round"
                      disabled={state.loading}
                      style={{ marginTop: "32px" }}
                    >
                      Sign Up
                    </Button>

                    {state.showAlert ? (
                      <Alert
                        message={state.alertMessage}
                        onClose={() =>
                          setState((prev) => ({
                            ...prev,
                            showAlert: false,
                          }))
                        }
                        type="error"
                        showIcon
                        closable
                        style={{ width: "100%", marginTop: "40px" }}
                      />
                    ) : null}
                  </Col>
                </Row>
              </form>

              <Text
                type="secondary"
                style={{
                  textAlign: "center",
                  fontSize: "1rem",
                  position: "absolute",
                  bottom: "-104px",
                }}
              >
                You data is safe and secure with us
              </Text>
              <Text
                type="secondary"
                style={{
                  textAlign: "center",
                  fontSize: "1rem",
                  position: "absolute",
                  bottom: "-128px",
                }}
              >
                &copy; 2021 knwol.io
              </Text>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default SignUp;
