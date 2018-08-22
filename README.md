# Thijs-Vision

See images that maybe (?probably not?) correlate with what you are saying as you are saying it.

This project uses a Raspberry Pi Zero W, microphone, hyperpixel display, google cloud speech recognition API, & google custom search API. Written in Javascript!

## Setup:

make sure you have node & npm installed on your rpi:

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

🕶 ✌️

git clone or copy over ssh to pi zero using scp:

`scp -r thijs-vision pi@pizero.local:projects`

`cd thijs-vision`

`npm install`

## Running:

On the raspberry pi (over ssh, preferably), run in project folder:

`DISPLAY=:0 chromium-browser -kiosk http://localhost:3000 & node app.js`

---

Made by 🐡[Stephanie](https://stephanie.lol)🐺 for the 💩[Stupid Hackathon Amsterdam](http://stupidhackathon.wtf)🌈
