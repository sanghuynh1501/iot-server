import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';
import Task from './Task.jsx';
import Detail from './Detail.jsx';
import Building from './Building.jsx';

import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/theme-fresh.css';
//import 'extendLib/styles/ag-pattern.css';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {detailData: null};
  }

  getDetailData(data) {
    this.setState({detailData: data});
  }
  // renderTasks() {
  //   let filteredTasks = this.props.tasks;
  //   if (this.state.hideCompleted) {
  //     filteredTasks = filteredTasks.filter(task => !task.checked);
  //   }
  //   return filteredTasks.map((task) => {
  //     const currentUserId = this.props.currentUser && this.props.currentUser._id;
  //     const showPrivateButton = task.owner === currentUserId;
  //
  //     return (
  //       <Task
  //         key={task._id}
  //         task={task}
  //         showPrivateButton={showPrivateButton}
  //       />
  //     );
  //   });
  // }

  render() {
    return (
      <div className="container">
        <header>
          {/*<h1>Danh sách thiết bị</h1>*/}
          <h1>Bản đồ KTX</h1>
        </header>
        {/*
          this.state.detailData ?
          <Detail data={this.state.detailData} /> :
          <Task tasks={this.props.tasks} getDetail={this.getDetailData.bind(this)}/>
        */}
        <Building/>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('tasks');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);
