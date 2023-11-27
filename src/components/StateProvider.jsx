import { produce } from 'immer';
import { useReducer } from "react";
import { createContainer } from 'react-tracked';
import _ from 'lodash';
import Layout from '../lib/Layout';

const getId = (() => {
  let lastId = 0;
  return () => lastId++;
})();

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

function recalculateLayout(state) {
  const layout = new Layout();
  for (const id in state.blocks) {
    const block = state.blocks[id];
    if (block.type === 'slab') {
      layout.add(new Layout(block.data.layouts));
    }
  }
  layout.toOrigin();

  state.layout = layout;
}

const reducer = produce((state, action) => {
  if (action.type === "RECALCULATE") {
    recalculateLayout(state);
  } else if (action.type === "CHANGE_DATA") {
    const block = _.get(state.blocks, action.path.join('.blocks.'));
    block.data = action.data;
    recalculateLayout(state);
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
