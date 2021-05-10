import React from "react";
import { PageHeader, Button as AntButton } from "antd";

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

export const Button = (props) => {
  return (
    <AntButton {...props} className={cx(styles.button)}>
      {props.children}
    </AntButton>
  );
};
