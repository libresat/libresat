import * as React from "react";
import { Component } from "react";
import { ExpandView } from "./ExpandView";
import { IExpandProps } from "../../types";

class Expand extends Component<IExpandProps> {
  state = {
    isOpen: !this.props.initiallyClosed
  };

  handleToggle = () => {
    !this.props.disabled &&
      this.setState({
        isOpen: !this.state.isOpen
      });
  };

  render() {
    return (
      <ExpandView
        open={this.state.isOpen}
        onToggle={this.handleToggle}
        {...this.props}
      />
    );
  }
}

export { Expand };
