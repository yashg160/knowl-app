import React from "react";
import { PageHeader, Button as AntButton, Input as AntInput } from "antd";

import cx from "classnames";
import styles from "./styles/Core.module.scss";

export const Navbar = () => {
  return (
    <PageHeader
      className="site-page-header-responsive"
      title="knowl.io"
      style={{
        borderBottom: "#ededed 1px solid",
      }}
    ></PageHeader>
  );
};

export const Button = ({ color = "primary", ...props }) => {
  return (
    <AntButton
      {...props}
      className={cx(
        { [styles.btnPrimary]: color === "primary" },
        { [styles.btnSecondary]: color === "secondary" }
      )}
    >
      {props.children}
    </AntButton>
  );
};

export const Input = (props) => {
  return <AntInput {...props} className={cx(styles.inputBase)} />;
};
