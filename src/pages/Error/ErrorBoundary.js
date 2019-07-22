import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, eventId: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      let eventId = null;
      if (process.env.NODE_ENV === 'production') {
        eventId = Sentry.captureException(error);
      }
      this.setState({ eventId });
    });
  }

  render() {
    if (this.state.error) {
      return (
        <span>Error</span>
      );
    } else {
      return this.props.children;
    }
  }
}
