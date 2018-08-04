import React, { PropTypes } from 'react';
import styles from './todoHeaderStyles';

const TodoHeader = (props) => (
  <div>
    <h1 style={styles.todoHeader}>TodoHeader</h1>
    <input
      value={props.todo.title}
      onChange={props.onTodoTextChange}
      className="form-control"
      type="text"
    />
    <button className="btn btn-lg" onClick={props.onAddTodo}>new todo item</button>
  </div>
);

TodoHeader.propTypes = {
  todo: PropTypes.object,
  onTodoTextChange: PropTypes.func,
  onAddTodo: PropTypes.func,
};

TodoHeader.defaultProps = {
  todo: {},
  onTodoTextChange: () => {},
  onAddTodo: () => {},
};

export default TodoHeader;
