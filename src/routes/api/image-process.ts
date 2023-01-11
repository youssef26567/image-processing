/* eslint-disable prettier/prettier */
import sharp from "sharp";

// interface Image {
//   source: string
//   target: string
//   width: number|null
//   height: number|null
// }
const processImage = async (
  source: string,
  target: string,
  width: number | null,
  height: number | null
): Promise<sharp.OutputInfo> => {
  return await sharp(source).resize(width, height).toFile(target);
};
export default processImage;
