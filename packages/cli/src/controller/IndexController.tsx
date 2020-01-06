import express from "express";
import ReactDOMServer from "react-dom/server";
import { IndexView } from "../view";
import * as Service from "../service";
import * as Config from "../config";
import { find } from "../utils";

export const create = (service: Service.Type, config: Config.Type) => {
  const router = express.Router();
  router.get("/", async (req, res) => {
    const serverUrl = `${req.protocol}://${req.hostname}:${config.server.port}`;
    try {
      const props: IndexView.Props = { serverUrl, url: req.url, context: {}, service, filePathList: config.filePathList };
      const html = ReactDOMServer.renderToString(await IndexView.create(props));
      res.send(html);
      res.end();
    } catch (error) {
      console.error(error);
    }
  });
  router.use("/manifest.json", express.static(find("@code-dependency/view/dist/manifest.json"), { maxAge: "5000" }));
  return router;
};