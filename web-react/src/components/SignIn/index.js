import React, { useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import * as Queries from "../../queries";
import { Navbar, Button, Input, FullScreenSpinner } from "../Core";
import { Typography, Row, Col, Alert } from "antd";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";

const { Text, Title } = Typography;

import cx from "classnames";
import styles from "./styles/SignIn.module.scss";

function SignIn(props) {
  const [state, setState] = useState({
    loading: false,
    showAlert: false,
    alertMessage: "An error occurred",
  });

  const userResult = useQuery(Queries.SIGN_IN_USER, {
    variables: {
      email: "",
      password: "",
    },
  });

  // Call e GQL API to sign the user in
  const [
    attemptSignIn,
    { signInLoading, signInError, signInData },
  ] = useLazyQuery(Queries.SIGN_IN_USER, {
    onCompleted: (data) => {
      console.log("Result", data);

      if (data.signInUser.status !== "OK") {
        // An error occurred
        throw Error(data.signInUser.message);
      }

      // Signed in successfully. Save token, id and proceed
      localStorage.setItem("TOKEN", data.signInUser.token);

      // Add a delay of 500ms to allow token to be set
      setTimeout(() => {
        // Move to the home screen
        props.history.push("/home");
      }, 5000);
    },
    onError: (err) => {
      setState((prev) => ({
        ...prev,
        showAlert: true,
        alertMessage: "Could not sign you in",
      }));
    },
  });

  console.log(userResult);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [emailInput, passwordInput] = e.target;

    // API call to create a new user
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
        showAlert: false,
      }));

      attemptSignIn({
        variables: {
          email: /* emailInput.value */ "yashg160@gmail.com",
          password: /* passwordInput.value */ "password",
        },
      });
    } catch (err) {
      console.error(err);
      setState((prev) => ({
        ...prev,
        loading: false,
        showAlert: true,
        alertMessage: err.message,
      }));
    }
  };

  if (userResult.loading || signInLoading) {
    return <FullScreenSpinner />;
  }

  // Loading complete. If sign in successfull, move the home screen
  if (!userResult.error && userResult.data.signInUser.status === "OK") {
    props.history.push("/home");
    return <FullScreenSpinner />;
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
                      value="yashg160@gmail.com"
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
                      value="password"
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

                    {state.showAlert || userResult.error ? (
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

export default SignIn;
