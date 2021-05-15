import React, { useState } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";

import { Navbar, Button, Input, FullScreenSpinner } from "../Core";
import { Typography, Row, Col, Alert } from "antd";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";

const { Text, Title } = Typography;

import cx from "classnames";
import styles from "./styles/SignIn.module.scss";

const SIGN_IN_USER = gql`
  mutation SignInUser($email: String!, $password: String!) {
    signInUser(email: $email, password: $password) {
      user {
        _id
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

const GET_USER = gql`
  query GetUser($_id: String!) {
    user(_id: $_id) {
      name
      email
    }
  }
`;

function SignIn(props) {
  const [state, setState] = useState({
    loading: false,
    showAlert: false,
    alertMessage: "Nothing to show",
  });

  const [signInUser] = useMutation(SIGN_IN_USER);

  async function handleSubmit(e) {
    e.preventDefault();

    const [emailInput, passwordInput] = e.target;

    // API call to create a new user
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
        showAlert: false,
      }));

      // Call the GQL API to sign the user in
      const signInUserResult = await signInUser({
        variables: {
          email: emailInput.value,
          password: passwordInput.value,
        },
      });

      if (signInUserResult.data.signInUser.status !== "OK") {
        // An error occurred
        console.log(signInUserResult.data.signInUser.code);
        throw Error(signInUserResult.data.signInUser.error.message);
      }

      // Signed in successfully. Save token, id and proceed
      localStorage.setItem("TOKEN", signInUserResult.data.signInUser.token);
      localStorage.setItem("ID", signInUserResult.data.signInUser.user[0]._id);

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

  const id = localStorage.getItem("ID");
  const token = localStorage.getItem("TOKEN");

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { _id: id },
  });

  if (!token || !id || error || !data) {
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
                <Title
                  level={2}
                  style={{ textAlign: "center", fontWeight: 500 }}
                >
                  Welcome Back
                </Title>
                <Text style={{ textAlign: "center", fontSize: "1.414rem" }}>
                  Sign in to your account
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
                        Sign In
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
                  Open up to a new world
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
        {state.loading && <FullScreenSpinner />}
      </>
    );
  }

  if (loading || state.loading) {
    return <FullScreenSpinner />;
  }

  if (data?.user && data?.user?.email && data?.user?.name) {
    props.history.push("/home");
    return null;
  }
}

export default SignIn;
