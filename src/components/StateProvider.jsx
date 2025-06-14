import { useReducer } from "react";
import { createContainer } from 'react-tracked';
import { produce } from 'immer';
import cloneDeep from 'lodash/cloneDeep';
import Layout from '../lib/Layout';
import { getBlockAtPath, getId, setLastId } from '../lib/reducer/utils';
import recalculateLayout from '../lib/reducer/recalculateLayout';
import addBlock from '../lib/reducer/addBlock';
import deleteBlock from '../lib/reducer/deleteBlock';
import changeData from '../lib/reducer/changeData';
import moveBlock from '../lib/reducer/moveBlock';
import toggleBlockDisabled from '../lib/reducer/toggleBlockDisabled';

const initialState = {
  templateHeader: "",
  blocks: {},
  layout: new Layout(),
  stateReplacementIndex: 0, // forces refreshing all block inputs on change
};

const initialGroupId = getId();
const initialSlabId = getId();

initialState.blocks[initialGroupId] = {
  id: initialGroupId,
  path: [initialGroupId],
  order: 0,
  type: 'group',
  data: {},
  blocks: {
    [initialSlabId]: {
      id: initialSlabId,
      path: [initialGroupId, initialSlabId],
      order: 0,
      type: 'slab',
      data: {
        layouts: [{
          uuid: '123c7881-2d35-4e0e-92db-bb2069242181',
          assets: [{}],
        }],
      },
    }
  },
};

function getMaxId(blocks) {
  let maxId = 0;
  for (const blockId in blocks) {
    maxId = Math.max(maxId, blockId);
    if (blocks[blockId].blocks && Object.keys(blocks[blockId].blocks).length > 0) {
      maxId = Math.max(maxId, getMaxId(blocks[blockId].blocks));
    }
  }
  return maxId;
}

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
    case "TOGGLE_BLOCK_DISABLED":
      toggleBlockDisabled(state, action);
      break;
    case "MOVE_BLOCK":
      moveBlock(state, action);
      break;
    case "SET_BLOCK_PROPERTY":
      const block = getBlockAtPath(state, action.path);
      block[action.key] = action.value;
      break;
    case "CHANGE_TEMPLATE_HEADER":
      state.templateHeader = action.value;
      recalculateLayout(state);
      break;
    case "REPLACE_BLOCKS":
      try {
        let newData;
        if (typeof action.value === "string") {
          newData = JSON.parse(action.value);
        } else {
          newData = action.value;
        }

        if (newData.templateHeader === undefined) {
          state.blocks = cloneDeep(newData);
        } else {
          state.blocks = cloneDeep(newData.blocks);
          state.templateHeader = newData.templateHeader;
        }

        state.stateReplacementIndex++;
        setLastId(getMaxId(state.blocks));
        recalculateLayout(state);
      } catch (e) {
        console.error(e);
      }
      break;
    default:
      throw new Error("unrecognized action type");
  }
});

const { Provider, useTrackedState, useUpdate } = createContainer(
  ({ reducer, initialState }) => useReducer(reducer, initialState)
);

export default function StateProvider({ children }) {
  return <Provider reducer={reducer} initialState={initialState}>
    {children}
  </Provider>;
}

export { useTrackedState, useUpdate };
