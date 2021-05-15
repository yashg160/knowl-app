import React, { useState, useEffect } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";

import { Navbar, Button, Input, FullScreenSpinner } from "../Core";

import * as Queries from "../../queries";

import "./styles/UserHome.module.scss";

function UserHome(props) {
  const userResult = useQuery(Queries.GET_USER);
  if (userResult.loading) {
    return <FullScreenSpinner />;
  }

  if (userResult.data.getUser.status !== "OK") {
    // User might nit be logged in. Move to sign in screen
    props.history.push("/signin");
    return null;
  }

  // User is logged in and data os available
  const userData = userResult.data.getUser;

  // First step of profile building is select spaces.
  if (
    !userResult.data.getUser.user[0].spaces ||
    !userResult.data.getUser.user[0].spaces.length === 0
  ) {
    props.history.push("/spaces");
    return null;
  }

  return (
    <>
      <Navbar />
      <h1>Show popular questions and recommendations etc.</h1>
    </>
  );
}

export default UserHome;
