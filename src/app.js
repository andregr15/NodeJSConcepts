const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid ID!'});
  }

  return next();
}

app.use("/repositories/:id", validateId);

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if(!repository) {
    return response.status(404).json({ error: `There is no repository with the id: ${id}`})
  }

  const { title, url, techs } = request.body;
  if(title) {
    repository.title = title;
  }
  if(url) {
    repository.url = url;
  }
  if(techs) {
    repository.techs = techs;
  }

  response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(404).json({ error: `There is no repository with the id: ${id}`})
  }

  repositories.splice(repositoryIndex, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if(!repository) {
    return response.status(404).json({ error: `There is no repository with the id: ${id}`})
  }

  repository.likes++;
  response.json({
    id: repository.id,
    likes: repository.likes
  });
});

module.exports = app;
