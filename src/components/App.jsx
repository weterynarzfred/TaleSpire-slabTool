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
              <li>🗹 array
                <ul>
                  <li>☐ simply clone and then apply sub-modifiers</li>
                  <li>☐ apply modifiers relative to last / initial instance</li>
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
                  <li>☐ option to rotate elements</li>
                  <li>☐ around zero / bounding box center</li>
                  <li>☐ axis offset</li>
                  <li>☐ axis selection</li>
                </ul>
              </li>
              <li>🗹 scale</li>
              <li>☐ replace anything / id -{'>'} id / slab</li>
              <li>☐ drop to nearest surface <small><i>(?)</i></small></li>
              <li>☐ filter random / too close / id and apply sub-modifiers
                <ul>
                  <li>☐ option to remove filtered</li>
                </ul>
              </li>
            </ul>
          </li>
          <li>☐ changing modifiers' order</li>
          <li>🗹 fix the copy buttons</li>
          <li>☐ saving state to localStorage <i><small>(?)</small></i></li>
          <li>🗹 collapsing modifier blocks</li>
          <li>☐ tooltips</li>
        </ul>
      </div>
      <Results />
      <BlockList />
    </div>
  </StateProvider>;
}
