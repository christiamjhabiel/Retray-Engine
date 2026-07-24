let editor;

document.addEventListener('DOMContentLoaded', () => {
  editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    mode: 'python',
    theme: 'dracula',
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    tabSize: 4,
    indentUnit: 4,
    smartIndent: true,
    lineWrapping: true,
    styleActiveLine: true,
    extraKeys: { "Ctrl-Space": "autocomplete" }
  });
  
  initPython();
});