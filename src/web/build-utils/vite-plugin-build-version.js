const htmlReplace = /<(html lang="en")>/i;
const currentVersion = Date.now().toString(16);
export default function VitePluginBuildVersion() {
  return {
    name: 'vite-plugin-build-version',

    transformIndexHtml(html) {
      return html.replace(htmlReplace, `<$1 data-version=${currentVersion}>`);
    }
  }
}