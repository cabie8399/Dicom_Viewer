import Router from './util/router';
import viewerInit from './page/viewer';

window.cabieViewer = {};

(function createRouter() {
    const root = document.querySelector('.root');
    const routes = [
        {
            path: '/',
            html: viewerInit(),
        },
        {
            path: '/viewer',
            html: viewerInit(),
        },
        {
            path: '/viewer/ss',
            html: viewerInit(),
        },
    ];

    window.cabieViewer.router = new Router(root, routes);;
}());

(async function routing() {
    window.cabieViewer.router.viewCurrentRoute();
}());
