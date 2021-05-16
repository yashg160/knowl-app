import React from "react";
import cx from "classnames";
import * as Queries from "../../queries";
import { useQuery } from "@apollo/client";

import { Space } from "../Core";

import styles from "./styles/Spaces.module.scss";

const Spaces = (props) => {
  const spacesResult = useQuery(Queries.GET_SPACES);
  if (spacesResult.loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className={cx(styles.spacesContainer)}>
      {spacesResult.data.spaces.map((space, index) => (
        <Space
          space={space}
          key={index}
          selected={props.selectedSpaces.includes(space._id)}
          onClick={() =>
            props.onClick(space._id, props.selectedSpaces.includes(space._id))
          }
        />
      ))}
    </div>
  );
};

export default Spaces;
