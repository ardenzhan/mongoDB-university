const express = require('express');
const app = express();
const port = 3000;
const engines = require('consolidate');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('hello', { name: 'World' });
});

app.use((req, res) => res.sendStatus(404));

app.listen(port, () => console.log(`Listening on port ${port}`));
