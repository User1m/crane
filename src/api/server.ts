import * as sh from "shelljs";
import * as express from "express";
import * as fs from "fs";
import * as bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 8080;

let resAlias;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req: any, res: any, next: Function) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.route("/").get((req: any, res: any) => {
  res.json({ message: "Welcome To Your Model API!" });
});

app.route("/run").post((req: any, res: any) => {
  readRequest(req, res);
});

const readRequest = (req: any, res: any) => {
  const contentType = req.headers["content-type"] || "";
  const mime = contentType.split(";")[0];
  let data = "";
  resAlias = res;

  if (req.method === "POST" && mime === "application/octet-stream") {
    console.log("PROCESSING IMAGE RAW DATA.....");
    req.setEncoding("binary");
    req.on("data", function(chunk: Buffer) {
      data += chunk;
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (data.length > 10 * Math.pow(10, 6)) {
        console.log("TOO MUCH DATA.....KILLING CONNECTION");
        res.send(`Image too large! Please upload an image under 10MB`);
        req.connection.destroy();
      }
    });

    req.on("end", function() {
      console.log("FINISH PROCESSING IMAGE RAW DATA.....");
      saveImageToDisk(data);
      // next();
    });
  }
};

const saveImageToDisk = data => {
  console.log("SAVING IMAGE TO DISK.....");
  fs.writeFile("/input.jpg", data, "binary", (err: Error) => {
    if (err) {
      console.log("ERROR!!! SAVING IMAGE TO DISK.....");
      console.log(err);
    } else {
      console.log("FINISH SAVING IMAGE TO DISK.....");
      console.log(`input.jpg: IMAGE SAVED`);
      executeScript((process as any).env.RUNSCRIPT, "/input.jpg", resAlias);
    }
  });
};

const executeScript = (runScript: string, input: string, res: any) => {
  sh.exec(`/usr/bin/python /project/${runScript} ${input}`, function(
    code: any,
    stdout: any,
    stderr: any
  ) {
    if (code !== 0) {
      console.log("Exit code:", code);
      console.log("Program stderr:", stderr);
      console.log("executeScript ERRORED OUT");
    } else {
      console.log("Program output:", stdout);
      console.log("FINISHED RUNNING executeScript SCRIPT.....");
      res.json(JSON.stringify(stdout, null, 2));
    }
  });
};

app.listen(port);
console.log(`API listening happens on port ${port}.`);
