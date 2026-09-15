// npm install --no-save --package-lock=false sharp
// Re-encode the reviewed source images without cropping, recolouring, mirroring or redrawing.
import sharp from 'sharp';
for(const stem of ['assets/reference/cub-uniform-boy','assets/reference/cub-uniform-girl','assets/teaching/right-hand-salute']){
  const result=await sharp(stem+'.jpg').avif({quality:65,effort:6,chromaSubsampling:'4:4:4'}).toFile(stem+'.avif');
  console.log(stem+'.avif',result.size);
}
