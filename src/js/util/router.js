export default class Router {
    constructor(root, routes) {
        this.root = root;
        this.routes = routes;

        window.addEventListener('popstate', () => {
            this.viewCurrentRoute();
        });
    }

    // navigate(path, data = null) {
    //     window.history.pushState(data, null, path);
    //     this.viewRoute(path);
    // };

    viewRoute(path) {
        const matchRoute = this.routes.find((route) => route.path === path);

        if (!matchRoute) {
            this.root.innerHTML = String.raw`<h1>這裡是404</h1>`;
            return;
        }
        matchRoute.html;
    }

    viewCurrentRoute() {
        const { pathname } = window.location;
        this.viewRoute(pathname);
    }
}
