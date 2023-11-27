import { produce } from 'immer';
import { useReducer } from "react";
import { createContainer } from 'react-tracked';
import _ from 'lodash';
import Layout from '../lib/Layout';
import { blockAtPath, getId, recalculateLayout } from '../lib/reducer/utils';
import addBlock from '../lib/reducer/addBlock';

const initialState = {
  blocks: {},
  layout: new Layout(),
};

const initialId = getId();
initialState.blocks[initialId] = {
  id: initialId,
  type: 'slab',
  data: {
    layouts: [{ uuid: 'fa309f05-6efc-41ec-91a7-1157fb7029f3', assets: [{}] }],
  },
};

recalculateLayout(initialState);

const reducer = produce((state, action) => {
  switch (action.type) {
    case "RECALCULATE":
      recalculateLayout(state);
      break;
    case "CHANGE_DATA":
      const block = blockAtPath(state, action.path);
      block.data = action.data;
      recalculateLayout(state);
      break;
    case "ADD_BLOCK":
      addBlock(state, action);
      break;
    default:
      throw "unrecognized action type";
  }
});

const { Provider, useTrackedState, useUpdate } = createContainer(
  ({ reducer, initialState }) => useReducer(reducer, initialState)
);

export default function StateProvider(props) {
  return <Provider reducer={reducer} initialState={initialState}>
    {props.children}
  </Provider>;
};

export { useTrackedState, useUpdate };
