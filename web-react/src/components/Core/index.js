import React from "react";
import { decode } from "jsonwebtoken";
import { PageHeader, Button as AntButton, Input as AntInput } from "antd";

import cx from "classnames";
import styles from "./styles/Core.module.scss";

import Spinner from "../../assets/spinner/ripple.gif";
import Text from "antd/lib/typography/Text";

export const Navbar = ({
  history,
  showDropdownMenu,
  showLogoutOption,
  showProfileOption,
}) => {
  const handleLogoutClick = () => {
    localStorage.removeItem("TOKEN");
    history.push("/");
  };

  const handleProfileClick = () => {
    const token = localStorage.getItem("TOKEN");

    if (token) {
      const loggedInUserData = decode(token, process.env.REACT_APP_JWT_SECRET);
      history.push(`/profile/${loggedInUserData._id}`);
    }
  };

  const getExtraOptions = () => {
    let options = [];
    if (showLogoutOption) {
      options.push(
        <Button
          transparent
          shape="round"
          textColor="dark"
          onClick={() => handleLogoutClick()}
        >
          Logout
        </Button>
      );
    }

    if (showProfileOption) {
      options.push(
        <Button
          transparent
          shape="round"
          textColor="dark"
          onClick={() => handleProfileClick()}
        >
          Profile
        </Button>
      );
    }

    return options;
  };

  return (
    <PageHeader
      className="site-page-header-responsive"
      title={
        <a
          href="/home"
          style={{ textDecoration: "none", outline: "none", color: "black" }}
        >
          knowl.io
        </a>
      }
      style={{
        borderBottom: "#ededed 1px solid",
      }}
      extra={getExtraOptions()}
    ></PageHeader>
  );
};

export const Button = ({
  color = "secondary",
  transparent = false,
  textColor = "light",
  ...props
}) => {
  return (
    <AntButton
      {...props}
      className={cx(
        { [styles.btnPrimary]: color === "primary" },
        { [styles.btnSecondary]: color === "secondary" },
        { [styles.btnTransparent]: transparent === true },
        { [styles.btnTextDark]: textColor === "dark" }
      )}
    >
      {props.children}
    </AntButton>
  );
};

export const Space = (props) => {
  return (
    <div
      className={cx(styles.spaceWrapper, {
        [styles.spaceWrapperSelected]: props.selected,
      })}
      onClick={() => props.onClick()}
    >
      <Text>{props.space.name}</Text>
    </div>
  );
};

export const Input = (props) => {
  return <AntInput {...props} className={cx(styles.inputBase)} />;
};

export const FullScreenSpinner = (props) => {
  return (
    <div className={cx(styles.spinnerContainer)}>
      <img src={Spinner} />
    </div>
  );
};
