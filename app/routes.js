var routes = [],
    handlerConfig;

handlerConfig = {
    description: "test config for new endpoints",
    handler: function handleOK(response, reply) {
        reply("end-point created but doesn't have code yet");
    }
};

routes.push({ path: "/", method: "GET", config: handlerConfig });
routes.push({ path: "/auth", method: "GET", config: handlerConfig });
routes.push({ path: "/me", method: "GET", config: handlerConfig });
routes.push({ path: "/score", method: "GET, POST", config: handlerConfig });

module.exports = routes;