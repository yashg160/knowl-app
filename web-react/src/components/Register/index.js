import React, { useState, useEffect } from "react";

import { Navbar, Button, Input } from "../Core";
import { Typography, Row, Col } from "antd";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";

const { Text, Title } = Typography;

import cx from "classnames";
import styles from "./styles/Register.module.scss";

function Register() {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    loading: false,
    showAlert: false,
    alertMessage: "Nothing to show",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const [nameInput, emailInput, passwordInput] = e.target;

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    // API call to create a new user
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
                      required
                      placeholder="Full Name"
                      prefix={<AiOutlineUser />}
                    />
                    <Input
                      size="large"
                      type="email"
                      required
                      placeholder="Email"
                      prefix={<AiOutlineMail />}
                      style={{ margin: "8px 0px" }}
                    />
                    <Input
                      size="large"
                      type="password"
                      required
                      placeholder="Password"
                      prefix={<AiOutlineLock />}
                    />

                    <Button
                      htmlType="submit"
                      color="primary"
                      shape="round"
                      style={{ marginTop: "32px" }}
                    >
                      Sign Up
                    </Button>
                  </Col>
                </Row>
              </form>

              <Text
                type="secondary"
                style={{
                  textAlign: "center",
                  fontSize: "1rem",
                  marginTop: "112px",
                }}
              >
                You data is safe and secure with us
              </Text>
              <Text
                type="secondary"
                style={{ textAlign: "center", fontSize: "1rem" }}
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

export default Register;
