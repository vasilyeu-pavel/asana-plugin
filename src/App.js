import React from 'react';
import * as Sentry from '@sentry/browser';

import 'bootstrap/dist/css/bootstrap.min.css';
import TouchBackend from 'react-dnd-touch-backend';
import { DragDropContext } from 'react-dnd';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import DragItemPreview from './components/DragItemPreview/DragItemPreview';

import routes from './routes';
import withTracker from './withTracker';

import { isVisiblePage } from './utils/isVisiblePage';
import ErrorBoundary from './pages/Error/ErrorBoundary';

import './styles/shards-dashboards.scss';

isVisiblePage();

const RELEASE = '0.1.0';
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: '*',
    release: RELEASE,
  });
}

const App = () => (
  <ErrorBoundary>
    <Router basename={process.env.REACT_APP_BASENAME || ''}>
      <Switch>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={withTracker(props => (
              <route.layout {...props}>
                <route.component {...props} />
              </route.layout>
            ))}
          />
        ))}
      </Switch>
    </Router>
    <DragItemPreview key="__preview" name="Item" />
  </ErrorBoundary>
);

export default DragDropContext(TouchBackend({
  // Enable only for local development from the desktop
  // enableTouchEvents: true,
  delayTouchStart: 600,
}))(App);
