import { useEffect } from 'react';
import Results from './Results';
import StateProvider from './StateProvider';
import BlockList from './blockParts/BlockList';
import { Tooltip } from 'react-tooltip';

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

      <div className="text" id="foot">
        <h2>done</h2>
        <ul>
          <li>🗹 encoding and decoding slabs results</li>
          <li>🗹 adding modifiers</li>
          <li>🗹 removing modifiers</li>
          <li>🗹 calculating results</li>
          <li>🗹 nested modifiers</li>
          <li>input types
            <ul>
              <li>🗹 number</li>
              <li>🗹 text</li>
              <li>🗹 select</li>
              <li>🗹 boolean</li>
            </ul>
          </li>
          <li>modifiers
            <ul>
              <li>🗹 slab</li>
              <li>🗹 duplicate</li>
              <li>🗹 offset</li>
              <li>🗹 rotate
                <ul>
                  <li>🗹 rotation variations</li>
                  <li>🗹 option to rotate elements</li>
                  <li>🗹 around zero / bounding box center</li>
                  <li>🗹 axis offset</li>
                  <li>🗹 axis selection</li>
                </ul>
              </li>
              <li>🗹 scale</li>
              <li>🗹 replace anything / id -{'>'} id / slab</li>
              <li>🗹 filter elements at random / by id and apply sub-modifiers
                <ul>
                  <li>🗹 option to remove filtered elements</li>
                  <li>🗹 filter elements that are too close to each other <small><i>(?)</i></small></li>
                </ul>
              </li>
            </ul>
          </li>
          <li>🗹 changing modifiers' order</li>
          <li>🗹 copy to clipboard buttons</li>
          <li>🗹 display at least some errors in inputs</li>
          <li>🗹 collapsing modifier blocks</li>
          <li>🗹 add expression evaluation</li>
          <li>🗹 user comments in block titles</li>
          <li>🗹 tooltips code</li>
        </ul>

        <h2>todo</h2>
        <ul>
          <li>☐ make this into a symbiote
            <ul>
              <li>☐ eyedropper tool</li>
              <li>☐ read from hand</li>
              <li>☐ write to hand</li>
            </ul>
          </li>
          <li>☐ tooltips content</li>
          <li>☐ make a showcase video</li>
          <li>☐ upload this thing somewhere</li>
        </ul>

        <h2>do later</h2>
        <ul>
          <li>modifiers
            <ul>
              <li>☐ drop to nearest surface <small><i>(?)</i></small>
                <ul>
                  <li>☐ option to drop the whole slab</li>
                </ul>
              </li>
              <li>☐ filter by position</li>
            </ul>
          </li>
          <li>☐ better error handling</li>
          <li>☐ drag and drop modifier order</li>
          <li>☐ disabling modifier blocks</li>
          <li>☐ saving state to localStorage <i><small>(?)</small></i></li>
          <li>☐ saving state to json <i><small>(?)</small></i></li>
          <li>☐ terrain generation <i><small>(?)</small></i></li>
        </ul>
      </div>
    </div>
    <Tooltip id="dropdown-tooltip" place="left-start" border="1px solid #eee" />
    <Tooltip id="default-tooltip" delayShow="500" border="1px solid #eee" />
  </StateProvider>;
}
