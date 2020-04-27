function createStore(reducer, preloadedState) {
  let currentReducer = reducer;
  let currentState = preloadedState;
  let currentListeners = [];
  let nextListeners = currentListeners;
  let isDispatching = false;

  function getState() {
    return currentState;
  }
  function subscribe(listener) {
    if (typeof listener !== "function")
      throw new Error("Expected the lisenter to be a function");
    let isSubscribed = true;
    nextListeners.push(listener);
    return function unsubscribed() {
      if (!isSubscribed) return;
      isSubscribed = false;
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  function dispatch(action) {
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    currentListeners = nextListeners;
    const listeners = currentListeners;

    for (let i = 0; i < listeners.length; i += 1) {
      const listener = listeners[i];
      listener();
    }
    return action;
  }
  return { dispatch, getState, subscribe };
}

const store = createStore((state, event) => {
  switch (event.type) {
    case "hi":
      return { ...state, hi: "lol" };
    case "bye":
      return { ...state, hi: "omg" };
    default:
      return state;
  }
}, 0);
