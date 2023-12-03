import Results from './Results';
import StateProvider from './StateProvider';
import BlockList from './blockParts/BlockList';

export default function App() {

  return <StateProvider>
    <div id="content">
      <div className="text">
        <h2>// TODO:</h2>
        <ul>
          <li>🗹 change the font of the todo list</li>
          <li>☐ write the intro</li>
          <li>🗹 calculating results</li>
          <li>🗹 adding modifiers</li>
          <li>🗹 removing modifiers</li>
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
              <li>🗹 duplicate
                <ul>
                  <li>🗹 simply clone and then apply sub-modifiers</li>
                </ul>
              </li>
              <li>🗹 offset
                <ul>
                  <li>☐ options for per axis wrapping</li>
                </ul>
              </li>
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
              <li>☐ drop to nearest surface <small><i>(?)</i></small>
                <ul>
                  <li>option to drop the whole slab</li>
                </ul>
              </li>
              <li>☐ filter random / too close <small><i>(?)</i></small> / id and apply sub-modifiers
                <ul>
                  <li>☐ option to remove filtered</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>🗹 changing modifiers' order</li>
          <li>🗹 fix the copy buttons</li>
          <li>🗹 display at least some errors in inputs</li>
          <li>☐ saving state to localStorage <i><small>(?)</small></i></li>
          <li>☐ saving state to json <i><small>(?)</small></i></li>
          <li>🗹 collapsing modifier blocks</li>
          <li>☐ disabling modifier blocks</li>
          <li>☐ tooltips</li>
          <li>☐ fix rotating tiles</li>
        </ul>
      </div>
      <Results />
      <BlockList />
    </div>
  </StateProvider>;
}
