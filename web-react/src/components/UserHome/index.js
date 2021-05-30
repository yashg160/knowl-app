import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { Navbar, Button, Input, FullScreenSpinner } from "../Core";

import * as Queries from "../../queries";

import "./styles/UserHome.module.scss";

function UserHome(props) {
  // const [signInUser] = useMutation(Mutations.SIGN_IN_USER);
  const userResult = useQuery(Queries.SIGN_IN_USER, {
    variables: {
      email: "",
      password: "",
    },
  });

  const userSpacesResult = useQuery(Queries.GET_USER_SPACES);
  console.log("User result", userResult);
  console.log("spaes result", userSpacesResult);

  const [state, setState] = useState({
    user: null,
    loading: false,
  });

  if (state.loading || userSpacesResult.loading || userResult.loading) {
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
    props.history.push("/spaces");
    return null;
  }

  return (
    <>
      <Navbar showLogoutOption history={props.history} />
      <h1>Show popular questions and recommendations etc.</h1>
    </>
  );
}

export default UserHome;
