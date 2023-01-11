/* eslint-disable prettier/prettier */
import fs from "fs-extra";
import path from "path";
import express from "express";
import image from "./api/image-process";

const router = express.Router();

router.get(
  "/api",
  function (req: express.Request, res: express.Response): void {
    //check if query parameter sent
    if (req.query.filename==null) {
      res.status(400).send("Please, enter your filename");
    } 
    
    else if(req.query.width==null || req.query.height==null){
     res.status(400).send("with or height must assign to a value");
  }
    else {
      const filename: string = req.query.filename as string;
      // eslint-disable-next-line prettier/prettier

      const width = req.query.width
        ? parseInt(req.query.width as string,10)
        : null;
      const height = req.query.height
        ? parseInt(req.query.height as string,10)
        : null;
      const unresized = path.resolve(
        __dirname,
        "../../images/unresized images",
        filename + ".jpg"
      );
      const resized = path.resolve(
        __dirname,
        "../../images/resized",
        filename + width + height + ".jpg"
      );
      if (width == 0 || height == 0) {
        res.status(500).send("width or height must not be assigend to zero");
      } else if (String(width) || String(height)) {
        res.status(500).send("Width or height must be a number");
      } else if (width == -1 || height == -1) {
        res.status(500).send("width or height must not be negative value");
      } else if (!fs.existsSync(unresized)) {
        res.status(500).send("  the image is not exists");
      } else {
        //get the path to thumb and images folders

        //check if file exists
        fs.stat(resized, function (err) {
          if (err == null) {
            //if file exists in thumb folder just display it
            fs.readFile(resized)
              .then((Data: Buffer) => {
                res.status(200).contentType("jpg").send(Data);
              })
              .catch((err) => {
                res.status(500).send(err);
              });
          } else {
            // file does not exist in thumb folder check if file exists in images
            //folder to start processing
            fs.stat(unresized, function (er) {
              if (er == null) {
                try {
                  image(unresized, resized, width, height).then(() => {
                    fs.readFile(resized)
                      .then((Data: Buffer) => {
                        res.status(200).contentType("jpg").send(Data);
                      })
                      .catch(() => {
                        res
                          .status(500)
                          .send("Error occurred processing the image");
                      });
                  });
                } catch (err) {
                  res
                    .status(500)
                    .send("Error occurred processing the image" + err);
                }
              }
            });
          }
        });
      }
    }
  }
);
//check server work
// router.get("/", (req:express.Request, res:express.Response):void => {
//   res.send("server is work !")
// })
export default router;
