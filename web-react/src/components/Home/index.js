import React from "react";
import { Typography, Row, Col } from "antd";
import { Layout } from "antd";

import { AiOutlineSearch, AiOutlineComment } from "react-icons/ai";

const { Content } = Layout;
const { Text, Title } = Typography;

import { Navbar, Button } from "../Core";
import HeroBanner from "./HeroBanner";
import Spaces from "./Spaces";
import Footer from "../Footer";

import cx from "classnames";
import styles from "./styles/Home.module.scss";

function Home() {
  return (
    <main>
      <Navbar />
      <HeroBanner />
      <section id="intro-content">
        <Content className={cx(styles.introContent, "globalContainer")}>
          <Title level={2} style={{ textAlign: "center" }}>
            Connect with people ready to share
          </Title>
          <Text>
            Find all the right answers for your questions from the right people
          </Text>
          <Row gutter={64} style={{ marginTop: "16px" }}>
            <Col className="gutter-row" span={10} xs={24} md={12}>
              <div className={cx(styles.introContentRowItem)}>
                <div className={cx(styles.iconContainer)}>
                  <AiOutlineSearch size={48} />
                </div>
                <Title
                  level={3}
                  style={{
                    textAlign: "center",
                    fontWeight: 500,
                    marginBottom: "0px",
                  }}
                >
                  Look for answers
                </Title>

                <Text>
                  Find answers for your questions. Quench you curiosity.
                </Text>

                <a
                  href="/signup"
                  style={{
                    textDecoration: "none",
                    outline: "none",
                  }}
                >
                  <Button
                    type="primary"
                    style={{
                      marginTop: "40px",
                    }}
                    shape="round"
                  >
                    Sign Up
                  </Button>
                </a>
              </div>
            </Col>

            <Col className="gutter-row" span={10} xs={24} md={12}>
              <div className={cx(styles.introContentRowItem)}>
                <div className={cx(styles.iconContainer)}>
                  <AiOutlineComment size={48} />
                </div>
                <Title
                  level={3}
                  style={{
                    textAlign: "center",
                    fontWeight: 500,
                    marginBottom: "0px",
                  }}
                >
                  Interact with people
                </Title>

                <Text>
                  People who know things that you do not. Learn. Grow.
                </Text>

                <a
                  href="#spaces"
                  style={{
                    textDecoration: "none",
                    outline: "none",
                  }}
                >
                  <Button
                    type="primary"
                    style={{
                      marginTop: "40px",
                    }}
                    shape="round"
                  >
                    View Spaces
                  </Button>
                </a>
              </div>
            </Col>
          </Row>
          <Spaces />
        </Content>
      </section>

      <section id="intro-numbers">
        <Content
          className={cx(styles.introContent, "globalContainer")}
          style={{ marginTop: "80px" }}
        >
          <Row gutter={[64, 64]} style={{ marginTop: "16px" }} justify="center">
            <Col
              className="gutter-row"
              span={10}
              xs={24}
              md={8}
              lg={6}
              style={{ textAlign: "center" }}
            >
              <Title level={3} style={{ fontWeight: 600, marginBottom: "0px" }}>
                100,000+
              </Title>
              <Text type="secondary">
                monthly visitors to knowl.io and book.io
              </Text>
            </Col>

            <Col
              className="gutter-row"
              span={10}
              xs={24}
              md={8}
              lg={6}
              style={{ textAlign: "center" }}
            >
              <Title level={3} style={{ fontWeight: 600, marginBottom: "0px" }}>
                1+ billion
              </Title>
              <Text type="secondary">times a person got help since 2010</Text>
            </Col>

            <Col
              className="gutter-row"
              span={10}
              xs={24}
              md={8}
              lg={6}
              style={{ textAlign: "center" }}
            >
              <Title level={3} style={{ fontWeight: 600, marginBottom: "0px" }}>
                150% ROI
              </Title>
              <Text type="secondary">
                from people using knowl instead of physical copies
              </Text>
            </Col>

            <Col
              className="gutter-row"
              span={10}
              xs={24}
              md={8}
              lg={6}
              style={{ textAlign: "center" }}
            >
              <Title level={3} style={{ fontWeight: 600, marginBottom: "0px" }}>
                1000+
              </Title>
              <Text type="secondary">
                knowl users active in every space daily
              </Text>
            </Col>
          </Row>
        </Content>
      </section>
      <Footer />
    </main>
  );
}

export default Home;
