import { useReducer } from "react";
import { createContainer } from 'react-tracked';
import { produce } from 'immer';
import _ from 'lodash';
import Layout from '../lib/Layout';
import { getBlockAtPath, getId } from '../lib/reducer/utils';
import recalculateLayout from '../lib/reducer/recalculateLayout';
import addBlock from '../lib/reducer/addBlock';
import deleteBlock from '../lib/reducer/deleteBlock';
import changeData from '../lib/reducer/changeData';
import moveBlock from '../lib/reducer/moveBlock';

const initialState = {
  blocks: {},
  layout: new Layout(),
};

const initialId = getId();
initialState.blocks[initialId] = {
  id: initialId,
  path: [initialId],
  order: 0,
  type: 'slab',
  data: {
    layouts: [{
      uuid: 'fa309f05-6efc-41ec-91a7-1157fb7029f3',
      assets: [{}],
    }],
  },
};

recalculateLayout(initialState);

const reducer = produce((state, action) => {
  switch (action.type) {
    case "RECALCULATE":
      recalculateLayout(state);
      break;
    case "CHANGE_DATA":
      changeData(state, action);
      break;
    case "ADD_BLOCK":
      addBlock(state, action);
      break;
    case "DELETE_BLOCK":
      deleteBlock(state, action);
      break;
    case "MOVE_BLOCK":
      moveBlock(state, action);
      break;
    case "SET_BLOCK_PROPERTY":
      const block = getBlockAtPath(state, action.path);
      block[action.key] = action.value;
      break;
    default:
      throw "unrecognized action type";
  }
});

const { Provider, useTrackedState, useUpdate } = createContainer(
  ({ reducer, initialState }) => useReducer(reducer, initialState)
);

export default function StateProvider({ children }) {
  return <Provider reducer={reducer} initialState={initialState}>
    {children}
  </Provider>;
};

export { useTrackedState, useUpdate };
