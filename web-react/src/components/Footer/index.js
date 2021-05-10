import React from "react";

import { Typography, Space, Row, Col, Divider, Layout } from "antd";

const { Text, Title, Link } = Typography;
const { Header, Footer: AntFooter, Sider, Content } = Layout;

import cx from "classnames";
import styles from "./styles/Footer.module.scss";

function Footer() {
    return <AntFooter className={cx(styles.footer)}>
        <Row gutter={[64, 64]} style={{ marginTop: '16px' }} justify="center">
            <Col className="gutter-row" span={10} xs={24} md={8} lg={6} style={{ textAlign: "left" }}>
                <Title level={4} style={{ fontWeight: 500, marginBottom: "0px", letterSpacing: "4px" }}>KNOWL.IO</Title>
                <br />
                <Link href="/about" target="_blank" rel="noopener">
                    About
                </Link>
                <br />
                <Link href="/about" target="_blank" rel="noopener">
                    Contact Us
                </Link>
                <br />
                <Link href="/about" target="_blank" rel="noopener">
                    Help
                </Link>
                <br />
                <Link href="/about" target="_blank" rel="noopener">
                    Docs
                </Link>
                <br />
            </Col>

            <Col className="gutter-row" span={10} xs={24} md={8} lg={6} style={{ textAlign: "left" }}>
                <Title level={4} style={{ fontWeight: 500, marginBottom: "0px", letterSpacing: "4px" }}>PRODUCTS</Title>
                <br />
                <Link href="/about" target="_blank" rel="noopener">
                    Knowl
                </Link>
                <br />
                <Link href="/about" target="_blank" rel="noopener">
                    Book
                </Link>
                <br />
                <Link href="/about" target="_blank" rel="noopener">
                    TestOwl
                </Link>
                <br />
                <Link href="/about" target="_blank" rel="noopener">
                    ReadMojo
                </Link>
                <br />
            </Col>

            <Col className="gutter-row" span={10} xs={24} md={8} lg={6} style={{ textAlign: "left" }}>
                <Title level={4} style={{ fontWeight: 500, marginBottom: "0px", letterSpacing: "4px" }}>COMPANY</Title>
                <br />
                <Link href="/about" target="_blank" rel="noopener">
                    Team
                </Link>
                <Link href="/about" target="_blank" rel="noopener">
                    Careers
                </Link>
                <br />
                <Link href="/about" target="_blank" rel="noopener">
                    Legal
                </Link>
                <br />
                <Link href="/about" target="_blank" rel="noopener">
                    Consult
                </Link>
                <br />
                <Link href="/about" target="_blank" rel="noopener">
                    Founders
                </Link>
                <br />
            </Col>
        </Row>
        <Title level={4} style={{ fontWeight: 400, marginBottom: "0px", textAlign: "center", marginTop: "40px" }} type="secondary">Knowl.io 2021 Created by Yash Gupta | MP@2021</Title>
    </AntFooter>
}

export default Footer;