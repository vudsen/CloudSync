window.onload = () => {
  appendRefreshLib()
  appendVite()
  appendMainScript()
}


function appendMainScript() {
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'http://localhost:10700/src/pages/popup/index.tsx';
  document.head.appendChild(script)
}

function appendRefreshLib() {
  const script = document.createElement('script');
  script.type = 'module';
  script.innerHTML = `import { injectIntoGlobalHook } from "http://localhost:10700/@react-refresh";
  injectIntoGlobalHook(window);
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => (type) => type;`
  document.head.appendChild(script)
}

function appendVite() {
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'http://localhost:10700/@vite/client';
  document.body.appendChild(script)
}