import React, { useState, useEffect } from "react";
import { decode } from "jsonwebtoken";
import { useQuery } from "@apollo/client";

import * as Queries from "../../queries";

import { Navbar, Button, FullScreenSpinner } from "../Core";

function UserProfile(props) {
  const userProfileResult = useQuery(Queries.GET_USER_PROFILE, {
    variables: {
      userId: props.match.params.userId,
    },
  });

  const [state, setState] = useState({
    userFound: false,
    showError: false,
    errorMessage: "",
    allowEditProfile: false,
  });

  useEffect(() => {
    if (!userProfileResult.loading) {
      setUpEditProfile();
    }
  }, [userProfileResult.loading]);

  const setUpEditProfile = () => {
    const token = localStorage.getItem("TOKEN");
    let loggedInUserData = {};

    if (token) {
      loggedInUserData = decode(token, process.env.REACT_APP_JWT_SECRET);
      console.log(loggedInUserData);
    }

    if (userProfileResult.error) {
      // Error occurred
    } else {
      if (userProfileResult.data.getUserProfile !== null) {
        // User with the id in the path was found.
        setState((state) => ({
          ...state,
          userFound: true,
        }));

        if (
          loggedInUserData._id === userProfileResult.data.getUserProfile._id
        ) {
          // Same user as being viewed
          setState((state) => ({
            ...state,
            allowEditProfile: true,
          }));
        }
      }
    }
  };

  if (userProfileResult.loading) {
    return <FullScreenSpinner />;
  }

  return (
    <>
      <Navbar showLogoutOption history={props.history} />
      <div className="globalContainer"></div>
    </>
  );
}

export default UserProfile;
