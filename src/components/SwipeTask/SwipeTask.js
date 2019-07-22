import React from 'react';
import PropTypes from 'prop-types';

import Task from '../Task/Task';

import { onComplete } from '../Task/TaskUtils';
import { disableScroll, enableScroll } from '../../utils/disableScroll';

import './SwipeableListItem.css';

class SwipeTask extends React.Component {
  // DOM Refs
  listElement;
  wrapper;
  background;

  // Drag & Drop
  dragStartX = 0;
  left = 0;
  dragged = false;

  // FPS Limit
  startTime;
  fpsInterval = 1000 / 60;

  constructor(props) {
    super(props);

    this.listElement = null;
    this.wrapper = null;
    this.background = null;

    this.clientX = [];
    this.clientY = [];
    this.isChecked = false;
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.onDragEndMouse);
    window.addEventListener('touchend', this.onDragEndTouch);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.onDragEndMouse);
    window.removeEventListener('touchend', this.onDragEndTouch);
  }

  isNotDrag = evt => !evt.target.getAttribute('class').includes('drag') && true;

  onDragStartMouse = (evt) => {
    if (this.isNotDrag(evt)) {
      const clientX = evt.clientX;
      this.onDragStart(clientX);
      window.addEventListener('touchmove', this.onMouseMove);
    }
  };

  onDragStartTouch = (evt) => {
    if (this.isNotDrag(evt) && !this.props.isFake) {
      const touch = evt.targetTouches[0];
      const clientX = touch.clientX;

      this.onDragStart(clientX);
      window.addEventListener('touchmove', this.onTouchMove);
    }
  };

  onDragStart = (clientX) => {
    this.dragStartX = clientX;
    this.listElement.className = 'ListItem';
    this.startTime = Date.now();
  };

  onDragEndMouse = () => {
    enableScroll();
    window.removeEventListener('mousemove', this.onMouseMove);
    this.onDragEnd();
  };

  onDragEndTouch = () => {
    enableScroll();
    this.isChecked = false;
    this.clientX = [];
    this.clientY = [];
    window.removeEventListener('touchmove', this.onTouchMove);
    this.onDragEnd();
  };

  onDragEnd = () => {
    const sleep = time => new Promise(resolve => setTimeout(resolve, time));

    const { dispatchTask, completed, id } = this.props;
    if (this.dragged) {
      this.dragged = false;
      if (this.left < (this.listElement.offsetWidth * 0.3 * -1) / 2) {
        this.left = -this.listElement.offsetWidth * 2;

        sleep(500).then(() => {
          this.listElement.className = 'BouncingListItem';
          this.listElement.style.transform = 'translateX(0px)';
        });

        dispatchTask({
          type: 'CHANGE_STATUS',
          payload: {
            ...this.props,
            completed: !completed,
          },
        });

        onComplete({ id, completed });
      } else {
        this.left = 0;
      }
      this.listElement.className = 'BouncingListItem';
      this.listElement.style.transform = `translateX(${this.left}px)`;
    }
  };

  onMouseMove = (evt) => {
    disableScroll();
    const left = evt.clientX - this.dragStartX;
    if (left < 0) {
      this.left = left;
    }
  };

  onTouchMove = (evt) => {
    const touch = evt.targetTouches[0];
    if (this.clientX.length === 5) {
      if (!this.isChecked || this.isSwipe()) {
        disableScroll();
        this.isChecked = true;
        requestAnimationFrame(this.updatePosition);
      }
      const left = touch.clientX - this.dragStartX;
      if (left < 0) {
        this.dragged = true;
        this.left = left;
      }
    }
    if (this.clientX.length < 5) {
      this.clientX.push(touch.clientX);
      this.clientY.push(touch.clientY);
    }
  };

  isSwipe = () => {
    const procentX = ((this.clientX[this.clientX.length - 1] - this.clientX[0]) / this.clientX[0]) * 100;
    const procentY = ((this.clientY[this.clientY.length - 1] - this.clientY[0]) / this.clientY[0]) * 100;
    if (Math.abs(procentX) > Math.abs(procentY)) {
      return true;
    }
    enableScroll();
    this.dragged = false;
    this.isChecked = false;
    this.clientX = [];
    this.clientY = [];
    window.removeEventListener('touchmove', this.onTouchMove);
    return false;
  };

  updatePosition = () => {
    if (this.dragged) requestAnimationFrame(this.updatePosition);

    const now = Date.now();
    const elapsed = now - this.startTime;

    if (this.dragged && elapsed > this.fpsInterval && this.listElement) {
      this.listElement.style.transform = `translateX(${this.left}px)`;

      const opacity = (Math.abs(this.left) / 100).toFixed(2);
      if (opacity < 1 && opacity.toString() !== this.background.style.opacity) {
        this.background.style.opacity = opacity.toString();
      }
      if (opacity >= 1) {
        this.background.style.opacity = '1';
      }

      this.startTime = Date.now();
    }
  };

  render() {
    return (
      <>
        <div className="Wrapper task-swipe-item" ref={div => (this.wrapper = div)}>
          <div ref={div => (this.background = div)} className="Background task-swipe-item">
            <span className="task-swipe-item">
              <i className="material-icons task-swipe-item">
                done
              </i>
            </span>
          </div>
          <div
            onClick={this.onClicked}
            ref={div => (this.listElement = div)}
            onTouchStart={this.onDragStartTouch}
            onMouseDown={this.onDragStartMouse}
            className="ListItem task-swipe-item"
          >
            {<Task {...this.props} />}
          </div>
        </div>
      </>
    );
  }
}

SwipeTask.propTypes = {
  dispatchTask: PropTypes.func.isRequired,
  completed: PropTypes.bool,
  id: PropTypes.number,
  isFake: PropTypes.bool,
};

SwipeTask.defaultProps = {
  completed: false,
  isFake: false,
  id: 1,
};

export default SwipeTask;
