export default function TemplateInputBar({ newTemplateName, setNewTemplateName, onSave }) {
  return (
    <div className="template-save-wrapper default-tooltip-anchor" data-tooltip-key="templateSave">
      <input
        type="text"
        placeholder="Template Name"
        spellCheck={false}
        maxLength={30}
        value={newTemplateName}
        onChange={(e) => setNewTemplateName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), onSave())}
      />
      <button className="template-menu-button" onClick={onSave}>
        save template
      </button>
    </div>
  );
}
