const express = require("express");
const cors = require("cors");
const {v4: uuid, validate: isUuid} = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const {title, url, techs} = request.body;
    const newRepository = {id: uuid(), title: title, techs: techs, url: url, likes: 0};
    repositories.push(newRepository);
    return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
    const {title, url, techs} = request.body;

    let changedRepository;

    repositories.map((r) => {
        if (r.id === request.params.id) {
            if (title) {
                r.title = title;
            }
            if (url) {
                r.url = url;
            }
            if (techs && Array.isArray(techs)) {
                r.techs = techs;
            }
            changedRepository = r;
        }
    });
    if (changedRepository) {
        return response.json(changedRepository);
    } else {
        return response.status(400).send();
    }
});

app.delete("/repositories/:id", (request, response) => {
    const index = repositories.findIndex(r => r.id === request.params.id);
    if (index >= 0) {
        repositories.splice(index, 1);
        return response.status(204).send();
    } else {
        return response.status(400).send();
    }
});

app.post("/repositories/:id/like", (request, response) => {
    const index = repositories.findIndex(r => r.id === request.params.id);
    if (index >= 0) {
        repositories[index].likes++;
        return response.json(repositories[index]);
    } else {
        return response.status(400).send();
    }

});

module.exports = app;
