import { useUpdate } from './StateProvider';

export default function BlockDeleteButton({ path }) {
  const dispatch = useUpdate();

  function handleBlockDeleteButton() {
    dispatch({
      type: "DELETE_BLOCK",
      path,
    });
  }

  return <svg className="BlockDeleteButton" viewBox="0 0 100 100" onClick={handleBlockDeleteButton}>
    <path d="M30 30L70 70" />
    <path d="M30 70L70 30" />
  </svg>;
}
