# Pet search

Pet search is an awesome app, that will help you to find your lost pets. If you lost or found someone, share information about it with others and help little cute to be with its parents!

  - Load the map
  - Add your message
  - Look throught other messages 
 
## Features

Pet search is very easy to use. It has simple UI. 

When you open this app the Google Map will be loaded. Please, enable geolocation if possible, this option increases benefit you get from the app usage. On the map you will see list of markers. They have a look of emojis: smiling faces if pet is founded by someone and crying if it is lost.

If you want to add your message you need to activate this option by clicking on Add marker button (it is made to avoid overlapping between custom and google map events). Then just click on the map, where you lost / found someone and modal window will be opened. There you need to fill in required fields (animal type, animal nickname, url to the photo of the pet and your contacts). Just save it!

Moreover, you  have a possibility to look information about the marker if you click on it. Openening this window allows you to edit information about that particular case. When you enter edit mode you can delete this marker.

On the map, there can be huge amount of markers, so we add filtering possibility. Just click Button with loop. There are several options: animal type, breed, nickname, age, color, status. It is also possible to look for markers that are in particular location, limited by the radius from your position.  

All markers stored at localStorage, so you can refresh your page and everything will be saved.

## Installation

Pet search requires Node.js v7+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ npm install
$ npm run start
```

## Tech

Pet search uses number of projects to work properly:

* Vue.js - HTML enhanced for web apps!
* Poi -  zero-config bundler

License
----

ISC
