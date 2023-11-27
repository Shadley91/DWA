// Define action types
const ActionTypes = {
  ADD: "ADD",
  SUBTRACT: "SUBTRACT",
  RESET: "RESET",
};

// Reducer function to manage state changes
function reducer(state = { count: 0 }, action) {
  switch (action.type) {
    case ActionTypes.ADD:
      return { ...state, count: state.count + 1 };
    case ActionTypes.SUBTRACT:
      return { ...state, count: state.count - 1 };
    case ActionTypes.RESET:
      return { ...state, count: 0 };
    default:
      return state;
  }
}

// Redux-inspired store
function createStore(reducer) {
  let state = undefined;
  const subscribers = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    subscribers.forEach((subscriber) => subscriber());
  };

  const subscribe = (subscriber) => {
    subscribers.push(subscriber);
    return () => {
      const index = subscribers.indexOf(subscriber);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    };
  };

  // Initialize state with default value
  dispatch({});

  return { getState, dispatch, subscribe };
}

// Create the store
const store = createStore(reducer);

// Subscribe to state changes
const unsubscribe = store.subscribe(() => {
  console.log("Current state:", store.getState());
});

// SCENARIO 1
console.log("Scenario 1:");
console.log("Initial state:", store.getState());
// Output: { count: 0 }

// SCENARIO 2
console.log("Scenario 2:");
store.dispatch({ type: ActionTypes.ADD });
store.dispatch({ type: ActionTypes.ADD });
// Output: { count: 2 }

// SCENARIO 3
console.log("Scenario 3:");
store.dispatch({ type: ActionTypes.SUBTRACT });
// Output: { count: 1 }

// SCENARIO 4
console.log("Scenario 4:");
store.dispatch({ type: ActionTypes.RESET });
// Output: { count: 0 }

// Unsubscribe from state changes
unsubscribe();
