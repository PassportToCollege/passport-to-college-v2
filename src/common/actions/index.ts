export interface Action<T, U = {}> {
  type: T;
  payload?: U;
}

export function ActionCreator<T, U = {}>(actionType: T, payload?: U): Action<T, U> {
  return {
    type: actionType,
    payload
  };
}