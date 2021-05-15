import React from "react";
import cx from "classnames";

import { Space } from "../Core";

import styles from "./styles/Spaces.module.scss";

const Spaces = (props) => {
  return (
    <div className={cx(styles.spacesContainer)}>
      {props.spaces.map((space, index) => (
        <Space space={space} key={index} />
      ))}
    </div>
  );
};

export default Spaces;
