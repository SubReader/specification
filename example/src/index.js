const express = require("express");
const jwt = require("jsonwebtoken");
const { DB } = require("./data");
const app = express();

app.use(express.json());
app.use("/static", express.static("../static"));

const secret = process.env.SECRET || "secret";

app.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    res.end("Email and password must be provided.");
    return;
  }

  const user = DB.users.find((user) => {
    return user.email == email && user.password == password;
  });

  if (!user) {
    res.status(404);
    res.end("Could not sign in.");
    return;
  }

  const expiresIn = 60 * 5; // 5 minutes
  const accessToken = await jwt.sign(
    {
      email: user.email,
      entitlements: user.entitlements,
    },
    secret,
    {
      subject: user.id,
      expiresIn,
      audience: "accessToken",
    }
  );

  const refreshToken = await jwt.sign({}, secret, {
    subject: user.id,
    audience: "refreshToken",
  });

  res.json({
    accessToken,
    refreshToken,
    expiresIn,
  });
});

app.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    req.status(400);
    req.end("refreshToken must be provided.");
  }

  const { sub } = await jwt.verify(refreshToken, secret, {
    audience: "refreshToken",
  });

  const user = DB.users.find((user) => user.id == sub);

  const expiresIn = 60 * 5; // 5 minutes
  const accessToken = await jwt.sign(
    {
      email: user.email,
      entitlements: user.entitlements,
    },
    secret,
    {
      subject: user.id,
      expiresIn,
      audience: "accessToken",
    }
  );

  res.json({
    accessToken,
    expiresIn,
  });
});

app.get("/search", (req, res) => {
  const { query } = req.query;
  return res.json(DB.titles.filter((title) => title.title.includes(query)));
});

app.get("/title/:id", async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(500);
    return res.end("Missing authorization header.");
  }

  const [_, token] = authorization.split(" ");

  try {
    await jwt.verify(token, secret, {
      audience: "accessToken",
    });

    const { id } = req.params;
    const title = DB.titles.find((title) => title.id == id);

    if (!title) {
      res.status(404);
      return res.end("Title not found.");
    }

    return res.json(title);
  } catch (error) {
    res.status(500);
    return res.end("Invalid token.");
  }
});

app.get("/title/:id/fingerprint", async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(500);
    return res.end("Missing authorization header.");
  }

  const [_, token] = authorization.split(" ");

  try {
    await jwt.verify(token, secret, {
      audience: "accessToken",
    });

    const { id } = req.params;
    const fingerprint = DB.fingerprints.find(
      (fingerprint) => fingerprint.id == id
    );

    if (!fingerprint) {
      res.status(404);
      return res.end("Title not found.");
    }

    return res.json(fingerprint);
  } catch (error) {
    console.error(error);
    res.status(500);
    return res.end("Invalid token.");
  }
});

app.get("/title/:id/subtitles", async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(500);
    return res.end("Missing authorization header.");
  }

  const [_, token] = authorization.split(" ");

  try {
    await jwt.verify(token, secret, {
      audience: "accessToken",
    });

    const { id } = req.params;
    const subtitle = DB.subtitles.find((subtitle) => subtitle.id == id);

    if (!subtitle) {
      res.status(404);
      return res.end("Subtitles not found.");
    }

    return res.json(subtitle);
  } catch (error) {
    console.error(error);
    res.status(500);
    return res.end("Invalid token.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
