import React from 'react'
import { renderToString } from 'react-dom/server'
import CoverStoryCard from './src/js/Container.jsx'

global.window = {}

function renderWithMode(mode) {
    switch (mode) {
        case 'section':
            return "x.renderSection()"
        case 'article':
            return "x.renderArticle()"
        default:
            return "x.renderSection()"
    }
}

// function getScriptString(mode, dataJSON, selector, site_configs) {
//     return `<script>
//             var x = new ProtoGraph.Card.toCoverStory(),
//                 params = {
//                     "selector": document.querySelector('${selector}'),
//                     "isFromSSR": true,
//                     "initialState": ${JSON.stringify(dataJSON)},
//                     "site_configs": ${JSON.stringify(site_configs)}
//                 };
//             x.init(params);
//             ${renderWithMode(mode)}
//         </script>
//     `
// }

function render(initialState, mode) {
    let content = renderToString(
        <CoverStoryCard
            dataJSON={initialState.dataJSON}
            mode={mode}
            renderingSSR={true}
        />
    );

    return { content, initialState };
}

module.exports = {
    render: render,
    // getScriptString: getScriptString
    instance: 'toCoverStory'
}