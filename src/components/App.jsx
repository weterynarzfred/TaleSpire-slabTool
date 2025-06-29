import { useEffect } from 'react';
import Results from './Results';
import StateProvider from './StateProvider';
import BlockList from './blockParts/BlockList';
import { Tooltip } from 'react-tooltip';
import tooltips from '../data/tooltips';
import TemplateSaving from './TemplateSaving';
import TemplateHeader from "./TemplateHeader";

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
        <h1>SlabTool</h1>
      </div>

      <TemplateHeader />
      <BlockList />
      <Results />
      <TemplateSaving />

      <div id="foot"></div>
    </div>
    <Tooltip
      id="dropdown-tooltip"
      place="top-start"
      border="1px solid #eee"
      anchorSelect=".add-block"
      render={({ activeAnchor }) => {
        const key = activeAnchor?.getAttribute('data-tooltip-key');
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
        if (!key) return null;

        // 🔒 Prevent parent from showing tooltip if any nested child also has one
        if (activeAnchor?.querySelector?.('[data-tooltip-key]')) return null;

        const content = tooltips[key];
        if (!content) return null;
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
    <Tooltip
      id="option-tooltip"
      delayShow={400}
      border="1px solid #eee"
      anchorSelect=".tooltip-option"
      render={({ activeAnchor }) => {
        const key = activeAnchor?.getAttribute("data-tooltip-key");
        if (!key) return null;
        const content = tooltips[key];
        if (!content) return null;
        return <div>{content}</div>;
      }}
    />
  </StateProvider>;
}
