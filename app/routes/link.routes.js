module.exports = (app) => {
    const links = require('../controllers/link.controller.js');

    app.post('/links', links.create);

    app.get('/links', links.findAll);

    app.get('/links/:id', links.findOne);

    app.post('/links/:id', links.update);

    app.get('/links/delete/:id', links.delete);
}