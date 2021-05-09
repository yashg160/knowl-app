import React from "react";
import { PageHeader } from "antd";

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
