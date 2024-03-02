import React, { Component } from 'react';
class ChildComponent extends Component {
  constructor(props) {
    super(props);
    console.log('3-ChildComponent constructor');
  }

  componentDidMount() {
    console.log('ChildComponent componentDidMount');
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('ChildComponent componentDidUpdate');
  }

  componentWillUnmount() {
    console.log('ChildComponent componentWillUnmount');
  }

  render() {
    console.log('4-ChildComponent render');
    return <div>Child Component</div>;
  }
}

class AnotherChildComponent extends Component {
  constructor(props) {
    super(props);
    console.log('5-AnotherChildComponent constructor');
  }

  componentDidMount() {
    console.log('AnotherChildComponent componentDidMount');
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('AnotherChildComponent componentDidUpdate');
  }

  componentWillUnmount() {
    console.log('AnotherChildComponent componentWillUnmount');
  }

  render() {
    console.log('6-AnotherChildComponent render');
    return <div>Another Child Component</div>;
  }
}

class ParentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { showChild: true };
    console.log('1-ParentComponent constructor');
  }

  componentDidMount() {
    console.log('ParentComponent componentDidMount');
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('ParentComponent componentDidUpdate');
  }

  toggleChild = () => {
    this.setState((prevState) => ({ showChild: !prevState.showChild }));
  };

  render() {
    console.log('2-ParentComponent render');
    return (
      <div>
        <h1>Parent Component</h1>
        <button onClick={this.toggleChild}>Toggle Child</button>
        {this.state.showChild && <ChildComponent />}
        <AnotherChildComponent />
      </div>
    );
  }
}
export default ParentComponent;