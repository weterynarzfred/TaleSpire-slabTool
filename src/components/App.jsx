import BlockList from './BlockList';
import StateProvider from './StateProvider';

export default function App() {

  return <StateProvider>
    <div id="content">
      <div className="text">
        <h2>// TODO:</h2>
        <ul>
          <li>☐ write the intro</li>
          <li>🗹 calculating results</li>
          <li>☐ adding/removing modifiers</li>
          <li>☐ nested modifiers</li>
          <li>modifiers
            <ul>
              <li>🗹 slab</li>
              <li>☐ array</li>
              <li>☐ offset</li>
              <li>☐ rotate</li>
              <li>☐ rotateElements</li>
              <li>☐ rotationVariations</li>
              <li>☐ slace</li>
            </ul>
          </li>
          <li>☐ fix copy buttons</li>
          <li>☐ saving state to local Storage <i><small>(?)</small></i></li>
        </ul>
      </div>
      <BlockList />
    </div>
  </StateProvider>;
}
