export default function TemplateImportExport({
  importInput,
  setImportInput,
  onImport,
  onCopyAll,
  onSort,
}) {
  return (
    <div className="template-import-wrapper">
      <div className="template-menu">
        <button className="template-menu-button" onClick={onImport}>Import template(s)</button>
        <button className="template-menu-button" onClick={onCopyAll}>Copy all templates</button>
        <button className="template-menu-button" onClick={onSort}>Sort A → Z</button>
      </div>
      <textarea
        className="template-import-textarea"
        placeholder="Paste template(s) to be imported here."
        value={importInput}
        onChange={(e) => setImportInput(e.target.value)}
        rows={6}
        spellCheck={false}
      />
    </div>
  );
}
