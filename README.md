# Speech to Image Necklace

See images that maybe (?probably not?) correlate with what you are saying as you are saying it.

This project uses a ~~Raspberry Pi Zero W~~ Raspberry Pi 3, microphone, hyperpixel4 display, google cloud speech recognition API, & google custom search API. Written in Javascript!

## Setup:

1. first, check your arm chip:
   `uname -m`

2. install node.js & npm:

   if it **doesn't** say arm6, 🎊 yay! Installing node.js & npm is gonna be a breeze! ☮️

   ```
   curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
   sudo apt-get install -y nodejs
   node -v
   npm -v
   ```

   😠 if `uname -m` said `arm6` (cuz you are using a Pi Zero W), i'm really sorry, you have to install node the following way and the app is probably not gonna work... :

   ```
   wget https://nodejs.org/dist/v8.11.4/node-v8.11.4.tar.gz
   tar xf node-v8.11.4-linux-armv6l.tar.xz
   node-v8.11.4-linux-armv6l/bin/node -v
   cd node-v8.11.4-linux-armv6l/
   sudo cp -R * /usr/local/
   export PATH=$PATH:/usr/local/bin
   node -v
   npm -v
   ```

3. git clone or copy over ssh to pi zero using scp:

   `git clone https://github.com/traumverloren/speech-to-image-necklace.git`

   OR

   `scp -r speech-to-image-necklace pi@YOUR_PI_NAME_HERE.local:projects`

4. install npm dependencies & SoX:

   ```
   cd speech-to-image-necklace
   sudo apt-get install sox libsox-fmt-all
   npm install
   ```

5. set up secret key files:

- for use of the [google speech api](https://cloud.google.com/speech-to-text/docs/quickstart-client-libraries), you'll need to create an account and include your own keys json file and name it `thijs-vision.json`

- for use of the [custom search api](https://developers.google.com/custom-search/json-api/v1/overview), you'll need to set that up as well and include your API_KEY in the `keys.js` file.

- move both files over from your local machine to rpi:

  ```
    scp -r keys.js pi@YOUR_PI_NAME_HERE.local:projects/speech-to-image-necklace

    scp -r thijs-vision.json pi@YOUR_PI_NAME_HERE.local:projects/speech-to-image-necklace
  ```

## Running:

On the raspberry pi (over ssh, preferably), run in project folder:

`npm start` or just `node app.js`

---

Made by 🐡[Stephanie](https://stephanie.lol)🐺 for the 💩[Stupid Hackathon Amsterdam](http://stupidhackathon.wtf)🌈
