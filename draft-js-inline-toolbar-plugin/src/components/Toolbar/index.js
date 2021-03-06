import React from 'react';
import { getVisibleSelectionRect } from 'draft-js';

// TODO make toolbarHeight to be determined or a parameter
const toolbarHeight = 44;

export default class Toolbar extends React.Component {

  state = {
    isVisible: false,
  }

  componentWillMount() {
    this.props.store.subscribeToItem('isVisible', this.onVisibilityChanged);
  }

  componentWillUnmount() {
    this.props.store.unsubscribeFromItem('isVisible', this.onVisibilityChanged);
  }

  onVisibilityChanged = (isVisible) => {
    // need to wait a tick for window.getSelection() to be accurate
    // when focusing editor with already present selection
    setTimeout(() => {
      const selectionRect = isVisible ? getVisibleSelectionRect(window) : undefined;

      let position;
      if (selectionRect) {
        const rect = this.el.offsetParent.getBoundingClientRect();
        position = {
          top: (selectionRect.top - rect.top) - toolbarHeight,
          left: (selectionRect.left - rect.left) + (selectionRect.width / 2),
          transform: 'translate(-50%) scale(1)',
          transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)'
        };
      } else {
        position = {
          transform: 'translate(-50%) scale(0)'
        };
      }

      this.setState({
        position,
      });
    }, 0);
  }

  setEl = (el) => {
    this.el = el;
  };

  render() {
    const { theme, store } = this.props;
    return (
      <div
        ref={this.setEl}
        className={theme.toolbarStyles.toolbar}
        style={this.state.position}
      >
        {this.props.structure.map((Component, index) => (
          <Component
            key={index}
            theme={theme.buttonStyles}
            getEditorState={store.getItem('getEditorState')}
            setEditorState={store.getItem('setEditorState')}
          />
        ))}
      </div>
    );
  }
}
