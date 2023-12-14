import { useEffect } from 'react';
import Results from './Results';
import StateProvider from './StateProvider';
import BlockList from './blockParts/BlockList';
import { Tooltip } from 'react-tooltip';
import tooltips from '../data/tooltips';

export default function App() {

  useEffect(() => {
    document.addEventListener("wheel", function (event) {
      if (document.activeElement.type !== "number") return;
      document.activeElement.blur();
      setTimeout(() => event.target.focus(), 0);
    });
  }, []);

  return <StateProvider>
    <div id="content">
      <div className="text">
        <h1>TaleSpire – SlabTools</h1>
        <p>This is a simple work in progress tool for editing slabs from <a href="https://talespire.com/" target="_blank" rel="noopener noreferrer">TaleSpire</a>. Don't expect much from it.</p>
      </div>

      <BlockList />
      <Results />

      <div id="foot">
        <div className="text">
          you can check the code on <a href="https://github.com/weterynarzfred/TaleSpire-slabTool" target="_blank" rel="noopener noreferrer">github</a>
        </div>
      </div>
    </div>
    <Tooltip
      id="dropdown-tooltip"
      place="left-start"
      border="1px solid #eee"
      anchorSelect=".add-block__menu .add-block__option"
      render={({ activeAnchor }) => {
        const key = activeAnchor?.querySelector('div')?.getAttribute('data-tooltip-key');
        if (key === undefined) return null;
        const content = tooltips[key];
        if (content === undefined || content === "") return null;
        return <div>{content}</div>;
      }}
    />
    <Tooltip
      id="default-tooltip"
      delayShow="500"
      border="1px solid #eee"
      anchorSelect=".default-tooltip-anchor"
      render={({ activeAnchor }) => {
        const key = activeAnchor?.getAttribute('data-tooltip-key');
        if (key === undefined) return null;
        const content = tooltips[key];
        if (content === undefined || content === "") return null;
        return <div>{content}</div>;
      }}
    />
    <Tooltip
      id="select-tooltip"
      place="right-start"
      border="1px solid #eee"
      anchorSelect=".select__menu .select__option"
      render={({ activeAnchor }) => {
        const key = activeAnchor?.querySelector('div')?.getAttribute('data-tooltip-key');
        if (key === undefined) return null;
        const content = tooltips[key];
        if (content === undefined || content === "") return null;
        return <div>{content}</div>;
      }}
    />
  </StateProvider>;
}
