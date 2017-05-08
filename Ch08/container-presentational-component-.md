# Container 與 Presentational Components 入門

## 前言
在聊完了 React 和 Redux 整合後我們來談談分離 Presentational 和 Container Component 的概念，若你是第一次聽過這個名詞，我建議你可以先看看 Redux 作者 Dan AbramovFollow 所寫的這篇文章 [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.vtcuxsurv)。

## Container 與 Presentational Components 超級比一比
以下先參考 [Redux 官網](http://redux.js.org/docs/basics/UsageWithReact.html) 列出兩者相異之處：

1. Presentational Components	
	- 用途：怎麼看事情（Markup、外觀）
	- 是否讓 Redux 意識到：否
	- 取得資料方式：從 props 取得
	- 改變資料方式：從 props 去呼叫 callback function
  - 寫入方式：手動處理

2. Container Components
 - 用途：怎麼做事情（擷取資料，更新 State）
 - 是否讓 Redux 意識到：是
 - 取得資料方式：訂閱 Redux State（store）
 - 改變資料方式：Dispatch Redux Action
 - 寫入方式：從 React Redux 產生

 從上面的分析讀者可以發現，兩者最大的差別在於 `Component` 主要負責單純的 UI 的渲染，而 `Container` 則負責和 Redux 的 store 溝通，作為 `Redux` 和 `Component` 之間的橋樑。這樣的分法可以讓程式架構和職責更清楚，所以接下來我們就使用上一章節的 Redux TodoApp 進行改造，改造成 Container 與 Presentational Components 模式。

## Container Components

以下是 `src/containers/TodoHeaderContainer/TodoHeaderContainer.js` 的部份：

```javascript
import { connect } from 'react-redux';
import TodoHeader from '../../components/TodoHeader';

// 將欲使用的 actions 引入
import {
  changeText,
  createTodo,
} from '../../actions';

const mapStateToProps = (state) => ({
  // 從 store 取得 todo state
  todo: state.getIn(['todo', 'todo'])
});

const mapDispatchToProps = (dispatch) => ({
  // 當使用者在 input 輸入資料值即會觸發這個函數，發出 changeText action 並附上使用者輸入內容 event.target.value
  onChangeText: (event) => (
    dispatch(changeText({ text: event.target.value }))
  ),
  // 當使用者按下送出時，發出 createTodo action 並清空 input 
  onCreateTodo: () => {
    dispatch(createTodo());
    dispatch(changeText({ text: '' }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TodoHeader);
```

以下是 `src/containers/TodoListContainer/TodoListContainer.js` 的部份：

```javascript
import { connect } from 'react-redux';
import TodoList from '../../components/TodoList';

import {
  deleteTodo,
} from '../../actions';

const mapStateToProps = (state) => ({
  todos: state.getIn(['todo', 'todos'])
});

const mapDispatchToProps = (dispatch) => ({
  onDeleteTodo: (index) => () => (
    dispatch(deleteTodo({ index }))
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TodoList);
```

## Presentational Components

以下是 `src/components/TodoHeader/TodoHeader.js` 的部份：

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

// 開始建設 Component 並使用 connect 進來的 props 並綁定事件（onChange、onClick）。注意我們的 state 因為是使用 `ImmutableJS` 所以要用 `get()` 取值

const TodoHeader = ({
  onChangeText,
  onCreateTodo,
  todo,
}) => (
  <div>
    <h1>TodoHeader</h1>
    <input type="text" value={todo.get('text')} onChange={onChangeText} />
    <button onClick={onCreateTodo}>送出</button>
  </div>
);

export default TodoHeader;
```

以下是 `src/components/TodoList/TodoList.js` 的部份：

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

// Component 部分值的注意的是 todos state 是透過 map function 去迭代出元素，由於要讓 React JSX 可以渲染並保持傳入觸發 event state 的 immutable，所以需使用 toJS() 轉換 component of array。
// 由 Component 傳進欲刪除元素的 index

const TodoList = ({
  todos,
  onDeleteTodo,
}) => (
  <div>
    <ul>
    {
      todos.map((todo, index) => (
        <li key={index}>
          {todo.get('text')}
          <button onClick={onDeleteTodo(index)}>X</button>
        </li>
      )).toJS()
    }
    </ul>
  </div>
);

export default TodoList;
```

以下是 `src/components/Main/Main.js` 的部份：

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import TodoHeaderContainer from '../../containers/TodoHeaderContainer';
import TodoListContainer from '../../containers/TodoListContainer';

const Main = () => (
  <div>
    <TodoHeaderContainer />
    <TodoListContainer />
  </div>
);

export default Main;
```

## 總結
That's it！透過區分 Container 與 Presentational Components 可以讓程式架構和職責更清楚了！接下來我們將運用我們所學實際開發兩個貼近生活的專案，讓讀者更加熟悉 React 生態系如何應用於實務上。

## 延伸閱讀
1. [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.vtcuxsurv)
2. [Redux Usage with React](http://redux.js.org/docs/basics/UsageWithReact.html)
3. [React Higher Order Components in depth](https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e#.r8srulpaj)
4. [React higher order components](http://www.darul.io/post/2016-01-05_react-higher-order-components)

## :door: 任意門
| [回首頁](https://github.com/kdchang/reactjs101) | [上一章：Redux 實戰入門](https://github.com/kdchang/reactjs101/blob/master/Ch07/react-redux-real-world-example.md) | [下一章：用 React + Router + Redux + ImmutableJS 寫一個 Github 查詢應用](https://github.com/kdchang/reactjs101/blob/master/Ch09/react-router-redux-github-finder.md) |

| [勘誤、提問或許願](https://github.com/kdchang/reactjs101/issues) |
