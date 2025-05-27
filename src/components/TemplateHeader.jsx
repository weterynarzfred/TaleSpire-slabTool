import { useEffect, useState } from "react";
import { useTrackedState, useUpdate } from "./StateProvider";

let changeTimeout;
export default function TemplateHeader() {
  const [inputValue, setInputValue] = useState("");
  const state = useTrackedState();
  const dispatch = useUpdate();

  useEffect(() => {
    clearTimeout(changeTimeout);
    changeTimeout = setTimeout(() => {
      if (state.templateHeader !== inputValue) {
        dispatch({
          type: "CHANGE_TEMPLATE_HEADER",
          value: inputValue,
        });
      }
    }, 500);

    return () => clearTimeout(changeTimeout);
  }, [inputValue]);

  useEffect(() => {
    setInputValue(state.templateHeader);
  }, [state.stateReplacementIndex]);

  return <div className="TemplateHeader">
    <textarea className="template-header-input" value={inputValue ?? ""} onChange={(e) => setInputValue(e.target.value)} />
  </div>;
}
