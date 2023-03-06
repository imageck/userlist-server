const express = require("express"),
      api     = require("auth0").ManagementClient,
      cors    = require("cors"),
      app     = express(),
      port    = process.env.PORT;

app.use(express.json());
app.use(cors());

const { users } = new api({
  domain: process.env.DOMAIN,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

app.get("/", (req, res) => {
  let params = {
    per_page: 10,
    ...req.query,
    include_totals: true,
    fields: "user_id,name,email,created_at,last_login,blocked",
    include_fields: true
  };
  users.getAll(params)
    .then(users => res.status(200).json(users))
    .catch(({ statusCode }) => res.sendStatus(statusCode));
});

app.patch("/", (req, res) => {
  let { userIds, blocked } = req.body;
  userIds.map(id => {
    users.update({ id }, { blocked })
      .catch(err => null);
  })
  res.sendStatus(204);
});
  
app.delete("/", (req, res) => {
  let userIds = req.body;
  userIds.map(id => {
    users.delete({ id })
      .catch(err => null)
  })
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log("App listening on port " + port);
});
