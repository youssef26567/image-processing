/* eslint-disable prettier/prettier */
import fs from 'fs-extra'
import path from 'path'
import express from "express"
import image from './api/image-process'

const router = express.Router()

router.get("/api", function (req:express.Request, res:express.Response):void {
  //check if query parameter sent 
  if (!req.query.width || !req.query.height || !req.query.filename) {
    res.status(400).send("Please, enter your filename,width,height")
  } else {
    const filename: string = req.query.filename as string
    // eslint-disable-next-line prettier/prettier
    
      
    const width = req.query.width
      ? parseInt(req.query.width as string, 10)
      : null
    const height = req.query.height
      ? parseInt(req.query.height as string, 10):null

    if(!Number(width)||!Number(height)){
      res.status(500).send("Width and height must be a number")
   
    }else{
    //get the path to thumb and images folders  
    const unresized = path.resolve(__dirname, "../../images/unresized images", filename + ".jpg")
    const resized = path.resolve(
      __dirname,
      "../../images/resized",
      filename + width + height + ".jpg"
    )
    //check if file exists
    fs.stat(resized, function (err) {
      if (err == null) {
        //if file exists in thumb folder just display it   
        fs
          .readFile(resized)
          .then((Data: Buffer) => {
            res.status(200).contentType("jpg").send(Data)
          })
          .catch((err) => {
            res.status(500).send(err)
          })
      } else  {
        // file does not exist in thumb folder check if file exists in images 
        //folder to start processing 
        fs.stat(unresized, function (er) {
          if (er == null) {
            try {
              image(unresized, resized, width, height).then(() => {
                fs
                  .readFile(resized)
                  .then((Data: Buffer) => {
                    res.status(200).contentType("jpg").send(Data)
                  })
                  .catch(() => {
                    res.status(500).send("Error occurred processing the image")
                  })
              })
            }
            catch (err) {
              res.status(500).send("Error occurred processing the image" + err)
            }
          } 
        })
       }
        
     })
  }
}
})
//check server work 
// router.get("/", (req:express.Request, res:express.Response):void => {
//   res.send("server is work !")
// })
export default router
