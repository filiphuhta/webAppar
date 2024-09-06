import * as React from 'react';
import { renderToString } from 'react-dom/server';
import router from '@sitevision/api/common/router';
import appData from '@sitevision/api/server/appData';
import App from './components/App';
import { getPages } from './utils/helpers';

router.get('/', (req, res) => {
  res.agnosticRender(renderToString(<App />), {
  });
});

router.post('/getReferences', (req, res) => {
  const page = appData.getNode('page');
  const pagesWithComponentsHtml = getPages(page);

  if (pagesWithComponentsHtml !== '') {
    res.json({ html: pagesWithComponentsHtml })
  } else {
    res.json({ html: '<p>Hittade inga sidor med det tillägget.</p>' })
  }
});
