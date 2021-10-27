import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { createSecureToken } from "../../lib/crypto";

import { getUser } from "../../lib/dbfuncprisma";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(400).send("method not allowed");
    return;
  }

  try {
    console.log(req.body);

    let { username, password } = req.body;
    console.log(username, password);

    let data = await getUser(username);

    console.log(data);

    if (!data) {
      res.status(401).json({ success: false, message: "invalid_credential" });
      return;
    }

    // let pg = await getPageData();
    // console.log(pg);
    let pass = bcrypt.compareSync(password, data.password);

    if (!pass) {
      res.status(401).json({ success: false, message: "invalid_credential" });
      return;
    }

    let token = createSecureToken({ username: data.username });
    // console.log(data);
    // console.log(token);
    // console.log(pass);

    const cookie = serialize("linkin.auth", token, {
      path: "/",
      httpOnly: true,
      sameSite: true,
      maxAge: 60 * 60 * 24 * 365,
    });

    // console.log(cookie);

    res.setHeader("Set-Cookie", [cookie]);

    res.status(200).json({ success: pass, token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}
