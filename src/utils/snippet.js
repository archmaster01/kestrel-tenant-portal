export const buildWidgetSnippet = (identifier) => {
    if (!identifier) return '';
    return `<script type="module" src="https://kestrel-cdn.example.com/widget-dist/widget.js" data-kestrel-id="${identifier}"><\/script>\n<kestrel-widget></kestrel-widget>`;
};