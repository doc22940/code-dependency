import * as ReactDOM from "react-dom/server";
import * as Service from "../service";
import * as Config from "../config";
import * as fs from "fs";
import * as path from "path";
import * as View from "./view";
import { find } from "../utils";
import manifest from "@code-dependency/view/dist/manifest.json";

export const create = (service: Service.Type, config: Config.Type) => {
  const ASSETS_BASE_DIR = "/assets";
  process.setMaxListeners(config.filePathList.length);
  const generateStaticHtml = async (pathname: string, publicPath: string, assets: View.Assets): Promise<string> => {
    const url = path.join("/", pathname.replace(path.extname(pathname), ""));
    const dotSource = service.dependencyCruiser.getDependenciesDot(pathname);
    const view = await View.create(url, publicPath, pathname, dotSource, config.filePathList, assets);
    return "<!DOCTYPE html>" + ReactDOM.renderToStaticMarkup(view);
  };

  const writePage = (dist: string, html: string) => {
    if (!fs.existsSync(path.dirname(dist))) {
      fs.mkdirSync(path.dirname(dist), { recursive: true });
    }
    fs.writeFileSync(dist, html, { encoding: "utf-8" });
  };

  const copyAssets = async (distDir: string): Promise<View.Assets> => {
    const assets: View.Assets = JSON.parse(JSON.stringify(manifest));
    const promises = Object.entries(manifest).map(([key, assetsPath]) => {
      if (path.extname(assetsPath) === ".html") {
        return;
      }
      return new Promise((resolve, reject) => {
        const src = find("@code-dependency/view/dist/" + assetsPath, false);
        const dist = path.join(distDir, assetsPath);
        if (!fs.existsSync(path.dirname(dist))) {
          fs.mkdirSync(path.dirname(dist), { recursive: true });
        }
        fs.copyFile(src, dist, error => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
        assets[key] = path.join(ASSETS_BASE_DIR, assetsPath);
      });
    });
    await Promise.all(promises);
    return assets;
  };

  return {
    generateStaticHtml: async (publicPath: string, outputBaseDir: string) => {
      const assets = await copyAssets(path.join(outputBaseDir, ASSETS_BASE_DIR));
      for await (const filePath of config.filePathList) {
        const pathname = filePath.source;
        const outputFilePath = path.join(outputBaseDir, "project", pathname).replace(path.extname(pathname), ".html");
        const html = await generateStaticHtml(filePath.source, publicPath, assets);
        writePage(outputFilePath, html);
      }
    },
  };
};
