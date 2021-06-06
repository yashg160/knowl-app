import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Typography } from "antd";

import { Navbar, Button, FullScreenSpinner } from "../Core";

import UserQuestion from "../UserQuestion";

import * as Queries from "../../queries";

import cx from "classnames";
import styles from "./styles/UserHome.module.scss";

const { Title } = Typography;

function UserHome(props) {
  // const [signInUser] = useMutation(Mutations.SIGN_IN_USER);
  const userResult = useQuery(Queries.SIGN_IN_USER, {
    variables: {
      email: "",
      password: "",
    },
  });

  const userSpacesResult = useQuery(Queries.GET_USER_SPACES);

  const userRecommendationsResult = useQuery(Queries.GET_USER_RECOMMENDATIONS);

  const [state, setState] = useState({
    user: null,
    loading: false,
  });

  if (
    userSpacesResult.loading ||
    userResult.loading ||
    userRecommendationsResult.loading
  ) {
    return <FullScreenSpinner />;
  }

  if (userResult.error || userResult.data.signInUser.status !== "OK") {
    // This is not desirable. Fix this later if possible
    if (localStorage.getItem("TOKEN")) {
      window.location.reload();
      return null;
    } else {
      // User not be logged in. Move to sign in screen
      props.history.push("/signin");
      return null;
    }
  }

  if (
    userSpacesResult.error ||
    userSpacesResult.data.getUserSpaces.status !== "OK"
  ) {
    // An error occured. Most likely not signed in.
    props.history.push("/signin");
    return null;
  }

  // First step of profile building is select spaces.
  if (
    !userSpacesResult.data.getUserSpaces.user[0].spaces ||
    !userSpacesResult.data.getUserSpaces.user[0].spaces.length === 0
  ) {
    props.history.push("/selectSpaces");
    return null;
  }

  return (
    <>
      <Navbar showLogoutOption history={props.history} />
      <div className="globalContainer">
        <div className={cx(styles.headerWrapper)}>
          <Title>Top Questions</Title>
          <a href="/askQuestion" className={cx(styles.unstyledHyperlink)}>
            <Button
              htmlType="submit"
              color="primary"
              shape="round"
              disabled={state.loading}
            >
              Ask Question
            </Button>
          </a>
        </div>
        <div className={cx(styles.contentWrapper)}>
          {userRecommendationsResult.data.getUserRecommendations.questions.map(
            (questionItem) => (
              <UserQuestion question={questionItem} key={questionItem._id} />
            )
          )}
        </div>
      </div>
    </>
  );
}

export default UserHome;
