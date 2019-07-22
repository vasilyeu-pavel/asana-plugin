import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'shards-react';

const HeaderNavigation = ({ children }) => (
  <Container fluid>
    <Row>
      <Col tag="main" className="main-content p-0" lg="12" md="12" sm="12">
        {children}
      </Col>
    </Row>
  </Container>
);

HeaderNavigation.propTypes = {
  children: PropTypes.object.isRequired,
};

export default HeaderNavigation;
