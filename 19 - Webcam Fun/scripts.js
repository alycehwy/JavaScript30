const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
    navigator.mediaDevices.getUserMedia({video: true,audio: false})
        .then(localMediaStream => {
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.error(err);
            alert('Something Wrong!!!');
        })
}

function paintToCanvas(){
    const width = video.videoWidth;
    const height = video.videoHeight;
    // set up the canvas size
    canvas.width = width;
    canvas.height = height;
    
    // draw the image on the canvas
    setInterval(() => {
        ctx.drawImage(video,0,0,width,height);
        let pixels = ctx.getImageData(0,0,width,height);
        
        // different effects
        // pixels = redEffect(pixels);

        // pixels = rgbSplit(pixels);
        // transparency
        // ctx.globalAlpha = 0.1;

        pixels = greenScreen(pixels);

        ctx.putImageData(pixels, 0, 0);
    },16);
}

function takePhoto(){
    // the sound for take photo
    snap.currentTime = 0;
    snap.play();

    const imgData = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = imgData;
    // make photo downloadable, second parameter is file name
    link.setAttribute('download','snap')
    link.innerHTML = `<img src=${imgData} alt='snap'/>`;
    // put new photo on the first
    strip.insertBefore(link,strip.firstChild);
}

function redEffect(pixels) {
    // pixels.data is an array including cycling r/g/b data
    for (let i = 0; i < pixels.data.length; i += 4) {
      pixels.data[i + 0] = pixels.data[i + 0] + 500; // red
      pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
      pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i - 150] = pixels.data[i + 0]; // red
      pixels.data[i + 500] = pixels.data[i + 1]; // green
      pixels.data[i - 500] = pixels.data[i + 2]; // blue
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};
    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    for(i = 0; i < pixels.data.length; i += 4){
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];
        
        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
                pixels.data[i + 3] = 0;
        }
    }

    return pixels;
}

getVideo();
video.addEventListener("canplay",paintToCanvas);
