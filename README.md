<div align="center">
    <img src="presentation/present-logo.jpg" alt="Simple tests logo" width="260">
</div>


# Simple Tests

[![Build Status](https://travis-ci.org/razrabotal/simple-tests-on-react.svg?branch=master)](https://travis-ci.org/razrabotal/simple-tests-on-react)
[![dependencies Status](https://david-dm.org/razrabotal/simple-tests-on-react/status.svg)](https://david-dm.org/razrabotal/simple-tests-on-react)

This is a React-app that adds awesome test to any web-page. 

## Install

```bash
yarn
yarn start
```

## Usage

Add two lines to your code.
```html
<link rel="stylesheet" href="https://taras.top/share/tests/main.css">
<script src="https://taras.top/share/tests/script.js"></script>
```

Add div emelent.
```html
<div id="root">
</div>
```

Write your test.
```html
<div id="root">
    ## Test title
    # Test Description
    
    First question
    - False answer - Comment after select
    - False answer - Comment after select
    + True answer - Comment after select
    
    Second question
    https://yoursite.com/images/question-image.jpg
    - False answer 
    + True answer - Comment after select
    - False answer
    
    ...
    
    Number points - Comment
    Number points - Commnet
    Number points - Comment   
</div>
```

## Example
Live demo: [codepen.io/razrabotal/pen/dKGPWR](https://codepen.io/razrabotal/pen/dKGPWRx)

```html
<div id="root">
## Hello, world
# This is example test

How are you?
http://hronika.info/uploads/posts/2016-01/1452884960_holms2.jpg
- Fine - No
- Good - Nope
+ Very well - Yes
- I don`t know - You are know

What is your name? 
- User
+ Root
- Admin - Impossible
- Dude

2 - Greate
1 - Norm
0 - Badly
</div>
```

![alt text](https://taras.top/share/tests/example.jpg "Example test")


