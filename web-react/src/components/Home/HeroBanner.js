import React from "react";
import { Row, Col } from "antd";
import { Typography } from "antd";
const { Text, Title } = Typography;

import cx from "classnames";
import styles from "./styles/HeroBanner.module.scss";

function Banner() {
  return (
    <div className={cx(styles.heroBanner)}>
      <div className={cx(styles.heroBannerContainer)}>
        <div className={cx(styles.heroBannerOpaque)}>
          <div className={cx(styles.heroBannerContent, "globalContainer")}>
            <Row>
              <Col sm={24} md={12} className={cx(styles.heroBannerTextColumn)}>
                <Title level={1} style={{ fontWeight: 400, color: "white" }}>
                  Ask the right questions
                  <br />
                  Get amazing answers
                </Title>
                <Text
                  style={{
                    marginTop: "24px",
                    color: "white",
                    fontSize: "1.414rem",
                  }}
                >
                  From the right people
                </Text>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
