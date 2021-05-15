import React, { useEffect, useState } from "react";
import cx from "classnames";
import Spaces from "../Spaces";
import * as Queries from "../../queries";
import { useQuery } from "@apollo/client";
import { Typography, Row, Col, Layout } from "antd";
import { Navbar, Button, Input, FullScreenSpinner } from "../Core";

import { AiOutlineSearch, AiOutlineComment } from "react-icons/ai";

const { Content } = Layout;
const { Text, Title } = Typography;

import styles from "./styles/UserSpaces.module.scss";

function UserSpaces(props) {
  const [state, setState] = useState({
    loading: false,
    selectedSpaces: [],
  });

  const userResult = useQuery(Queries.GET_USER);
  console.log("results", userResult.data);
  if (userResult.loading) {
    return <FullScreenSpinner />;
  }

  if (userResult.error || userResult.data.getUser.status !== "OK") {
    props.history.push("/signin");
    return null;
  }

  return (
    <div>
      <Navbar />
      <main className={cx(styles.mainContainer)}>
        <section className={cx(styles.spacesContainer)}>
          <Title level={2}>
            Select your <strong>spaces</strong>
          </Title>
          <Title level={4}>
            You will be suggested content based on your selection. You can
            change this at any time.
          </Title>
          <Spaces selectedSpaces={state.selectedSpaces} />
          <Button
            htmlType="submit"
            color="secondary"
            shape="round"
            disabled={state.loading}
            style={{ marginTop: "48px" }}
          >
            Get Started
          </Button>
        </section>
      </main>
    </div>
  );
}

export default UserSpaces;
