import React from "react";
import { Typography, Space } from "antd";
import { Layout } from "antd";

const { Header, Footer, Sider, Content } = Layout;
const { Text, Title } = Typography;

import { Navbar } from "../Core";
import HeroBanner from "./HeroBanner";
import Spaces from "./Spaces";

import cx from "classnames";
import styles from "./styles/Home.module.scss";

function Home() {
  return (
    <main>
      <Navbar />
      <HeroBanner />
      <Content className={cx(styles.introContent, "globalContainer")}>
        <Title level={2} style={{ textAlign: "center" }}>
          Connect with people ready to share
        </Title>
        <Text>
          Find all the right answers for your questions from the right people
        </Text>
        <Spaces />
      </Content>
    </main>
  );
}

export default Home;
