import React from "react";
import { PageHeader, Button as AntButton, Input as AntInput } from "antd";

import cx from "classnames";
import styles from "./styles/Core.module.scss";

import Spinner from "../../assets/spinner/ripple.gif";
import Text from "antd/lib/typography/Text";

export const Navbar = ({ history, showDropdownMenu, showLogoutOption }) => {
  const handleLogoutClick = () => {
    localStorage.removeItem("TOKEN");
    history.push("/");
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

    return options;
  };

  return (
    <PageHeader
      className="site-page-header-responsive"
      title="knowl.io"
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
