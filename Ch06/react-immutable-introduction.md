# ImmutableJS Introduction

![ImmutableJS](./images/immutable.png "ImmutableJS")

## Foreword
Usually in Javascript there are two data categories: Primitive (String, Number, Boolean, null, undefinded) and Object (Reference). In JavaScript the manipulation of objects is a lot easier than in Java, yet as a result of the relative flexability and permissive nature, some problems are created. In JavaScript Object data is mutable, due to the use of Reference method, therefore editing a cloned value will inadvertently alter the source value. An example is shown below where `map2`'s value points to `map1`, so once the value of `map1` is changed, `map2`'s value is also impacted.

```javascript
var map1 = { a: 1 }; 
var map2 = map1; 
map2.a = 2
```

Usually this is avoided with `deepCopy`, but this strategy wastes a lot of resources. In order to have a better solution, we can make use of `Immutable Data`, the meaning of Immutable Data is data that upon establishment, can no longer be altered.

In order to solve this problem, in 2013 Facebook developer Lee Byron created [ImmutableJS](https://facebook.github.io/immutable-js/), but this did not get included by default in the React kit (although there is a simplified Helper), but the appearance of `ImmutableJS` in fact solved problems encountered in `React`, even `Redux`.

The example below uses the effect of `ImmutableJS`, the reader may discover although we made changes to the value of `map1`, the original source value is not affected (because no changes will affect the source data), although the use of `deepCopy` creates a similar effect, it also creates a large amount of processing resources and memory, instead `ImmutableJS` easily shares unaltered data (for example below the data `b` is shared between `map1` and `map2`), permitting better performance. 

```javascript
import Immutable from 'immutable';

var map1 = Immutable.Map({ a: 1, b: 3 });
var map2 = map1.set('a', 2);

map1.get('a'); // 1
map2.get('a'); // 2
```

## ImmutableJS Characteristics Intro
ImmutableJS provides 7 kinds of immutable data types: `List`, `Map`, `Stack`, `OrderedMap`, `Set`, `OrderedSet`, `Record`. Any operations on Immutable objects will return a new value. Among these the more commonly used ones are `List`, `Map` and `Set`:

1. Map: an object with key/value, in ES6 it corresponds to native `Map`

  ```javascript
  const Map= Immutable.Map;
  
  // 1. Map size
  const map1 = Map({ a: 1 });
  map1.size
  // => 1

  // 2. Create or replace a Map key
  // set(key: K, value: V)
  const map2 = map1.set('a', 7);
  // => Map { "a": 7 }

  // 3. delete key
  // delete(key: K)
  const map3 = map1.delete('a');
  // => Map {}

  // 4. clear map content
  const map4 = map1.clear();
  // => Map {}

  // 5. update Map key
  // update(updater: (value: Map<K, V>) => Map<K, V>)
  // update(key: K, updater: (value: V) => V)
  // update(key: K, notSetValue: V, updater: (value: V) => V)
  const map5 = map1.update('a', () => (7))
  // => Map { "a": 7 }

  // 6. merge Maps
  const map6 = Map({ b: 3 });
  map1.merge(map6);
  // => Map { "a": 1, "b": 3 }
  ```

2. List: ordered and allows duplicate values, corresponds to normal Arrays

  ```javascript
  const List= Immutable.List;
  
  // 1. Get List length
  const arr1 = List([1, 2, 3]);
  arr1.size
  // => 3

  // 2. Create or replace List elements
  // set(index: number, value: T)
  // swap elements by indices
  const arr2 = arr1.set(-1, 7);
  // => [1, 2, 7]
  const arr3 = arr1.set(4, 0);
  // => [1, 2, 3, undefined, 0]

  // 3. deleting elements
  // delete(index: number)
  // delete an element at a certain index
  const arr4 = arr1.delete(1);
  // => [1, 3]

  // 4. insert element into List
  // insert(index: number, value: T)
  // insert value at index
  const arr5 = arr1.insert(1, 2);
  // => [1, 2, 2, 3]

  // 5. 清空 List
  // clear()
  const arr6 = arr1.clear();
  // => []
  ```

3. Set: unordered and no duplicate elements allowed

  ```javascript
  const Set= Immutable.Set;
  
  // 1. create Set
  const set1 = Set([1, 2, 3]);
  // => Set { 1, 2, 3 }

  // 2. add new element
  const set2 = set1.add(1).add(5);
  // => Set { 1, 2, 3, 5 } 
  // because Set prohibits duplicate elements, 1 only appears once

  // 3. delete an element
  const set3 = set1.delete(3);
  // => Set { 1, 2 }

  // 4. union
  const set4 = Set([2, 3, 4, 5, 6]);
  set1.union(set4);
  // => Set { 1, 2, 3, 4, 5, 6 }

  // 5. intersection
  set1.intersect(set4);
  // => Set { 2, 3 }

  // 6. except
  set1.subtract(set4);
  // => Set { 1 }
  ```

## ImmutableJS characteristics summary
1. Persistent Data Structure
  In the world of `ImmutableJS`, once data is created it cannot be mutated, it remains `Immutable`. This prevents the below situation:

  ```javascript
  var obj = {
   a: 1
  };

  funcationA(obj);
  console.log(obj.a) // unsure of the resulting value
  ```

  Using `ImmutableJS` eliminates this problem:

  ```javascript
  // some developers will prepend a `$` before `Immutable` variables to allow differentiation.

  const $obj = fromJS({
   a: 1
  });

  funcationA($obj);
  console.log($obj.get('a')) // 1
  ```

2. Structural Sharing
  In order to maintain data structure immutability, as well as avoiding `deepCopy`-esque methods where every node's data is copied and creates a waste of resources, `ImmutableJS` makes use of Structural Sharing, meaning if a node within the object tree is altered, only that node and the parent nodes affected by it are edited, everything else is shared.

  ```javascript
  const obj = {
    count: 1,
    list: [1, 2, 3, 4, 5]
  }
  var map1 = Immutable.fromJS(obj);
  var map2 = map1.set('count', 4);

  console.log(map1.list === map2.list); // true
  ```

3. Support Lazy Operation

  ```javascript
  Immutable.Range(1, Infinity)
  .map(n => -n)
  // Error: Cannot perform this action with an infinite size.

  Immutable.Range(1, Infinity)
  .map(n => -n)
  .take(2)
  .reduce((r, n) => r + n, 0); 
  // -3
  ```

4. A rich API that also provides a method for quick conversion to source JavaScript
  In ImmutableJS `fromJS()` and `toJS()` may be used to commence conversion between JavaScript and ImmutableJS. But because the conversion process is resource intensive, if you have decided to import `ImmutableJS` please try to keep data structures in an `Immutable` state.

5. Support of Functional Programming
  `Immutable` inherently uses Functional Programming concepts, so in `ImmutableJS` many Functional Programming syntaxes are supported, for example: `map`, `filter`, `groupBy`, `reduce`, `find`, `findIndex` etc.

6. Easily Redo/Undo history

## React performance optimization
`ImmutableJS` not only helps with `Flux/Redux` integration, it optimizes the performance of basic react. Below is an easy way to optimize React performance:

Traditional JavaScript comparison method, if the data type is Primitive there will be no problem:

```javascript
// shouldComponentUpdate compares the current prop with the next, if it is the same no re-rendering takes place, improving performance
shouldComponentUpdate (nextProps) {
    return this.props.value !== nextProps.value;
}
```

If objects are being compared there will be a problem:

```javascript
// Let this.props.value be { foo: 'app' }
// Let nextProps.value be { foo: 'app' },
// Although both have the same value, but as the referenced location is different, they count as being different. But because the values are identical re-rendering should be avoided
this.props.value !== nextProps.value; // true
```

Using `ImmutableJS`:

```javascript
var SomeRecord = Immutable.Record({ foo: null });
var x = new SomeRecord({ foo: 'app'  });
var y = x.set('foo', 'azz');
x === y; // false
```

In ES6 we can use the officially provided `PureRenderMixin` for comparison operations, resulting in cleaner code:

```javascript
import PureRenderMixin from 'react-addons-pure-render-mixin';
class FooComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    return <div className={this.props.className}>foo</div>;
  }
}
```

## Summary
Although `ImmutableJS` importation can bring many benefits and increases in performance, the overall file size becomes larger and it is invasive, one should evaluate the suitability for the current project prior to importing. In the next chapter we will discuss how to integrate `ImmutableJS` with `Redux` using a practical application as example.

## Extended Reading
1. [Official Website](https://facebook.github.io/immutable-js/)
2. [Immutable.js Initial Knowledge](http://www.w3cplus.com/javascript/immutable-js.html)
3. [Immutable in-depth explanation and putting to practice in React](https://github.com/camsong/blog/issues/3)
4. [Why is Immutable.js needed](http://zhenhua-lee.github.io/react/Immutable.html)
5. [facebook immutable.js purpose, when to use?](https://www.zhihu.com/question/28016223)
6. [React nested Component performance optimization](https://blog.wuct.me/react-%E5%B7%A2%E7%8B%80-component-%E6%95%88%E8%83%BD%E5%84%AA%E5%8C%96-b01d8a0d3eff#.3kf4h1xq1)
7. [PureRenderMixin](https://facebook.github.io/react/docs/pure-render-mixin.html)
8. [seamless-immutable](https://github.com/rtfeldman/seamless-immutable)
9. [Immutable Data Structures and JavaScript](http://jlongster.com/Using-Immutable-Data-Structures-in-JavaScript)

(image via [risingstack](https://risingstack-blog.s3.amazonaws.com/2016/Jan/immutable_logo_for_react_js_best_practices-1453211749818.png))

## :door: Nexus
| [Home](https://github.com/sycherng/reactjs101/tree/en-US) | [Previous article: Learn by Writing: React Router Introduction](https://github.com/sycherng/reactjs101/blob/en-US/Ch05/react-router-introduction.md) | [Next article: Flux Basic Concept and Putting to Practice](https://github.com/sycherng/reactjs101/blob/en-US/Ch07/react-flux-introduction.md) |

| [Corrections, questions, or requests](https://github.com/kdchang/reactjs101/issues) |
