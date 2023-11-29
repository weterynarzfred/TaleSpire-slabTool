import { useUpdate } from '../StateProvider';

export default function BlockHeader({ block }) {
  const dispatch = useUpdate();

  function handleBlockDeleteButton() {
    dispatch({
      type: "DELETE_BLOCK",
      path: block.path,
    });
  }

  return <div className="BlockHeader">
    <svg className="BlockDeleteButton" viewBox="0 0 100 100" onClick={handleBlockDeleteButton}>
      <path d="M30 30L70 70" />
      <path d="M30 70L70 30" />
    </svg>
    <div className="block__title">{block.type}</div>
  </div>;
}
