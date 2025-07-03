import { useEffect, useRef, useState } from "react";
import { useTrackedState, useUpdate } from "./StateProvider";

let changeTimeout;
export default function TemplateHeader() {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef(null);
  const state = useTrackedState();
  const dispatch = useUpdate();

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      const minHeight = 10 * 10;
      el.style.height = Math.max(el.scrollHeight+16, minHeight) + "px";
    }
  }, [inputValue]);

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

  return (
    <div className="TemplateHeader default-tooltip-anchor" data-tooltip-key="header">
      {state.templateHeaderError !== undefined && (
        <div className="block__error">{state.templateHeaderError}</div>
      )}
      <textarea
        ref={textareaRef}
        value={inputValue}
        placeholder={"# Comments\n\nGlobal variables:\nx = 5\nvariable = 7"}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
}
