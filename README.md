# PostHTML-bem-sugar
[![Build Status](https://travis-ci.org/rajdee/posthtml-bem.svg?branch=master)](https://travis-ci.org/rajdee/posthtml-bem?branch=master) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[PostHTML](https://github.com/posthtml/posthtml) plugin for support to simplify the maintenance of [BEM](http://bem.info) naming structure in jade.


## Install

```
$ npm install --save-dev posthtml-jade posthtml-bem posthtml-bem-sugar
```


##Features

### Blocks

```jade
.-MadTeaParty
  | Mad Tea Party
```

This would render like

```html
<div class="MadTeaParty">
    Mad Tea Party
</div>
```


### Elements

```jade
.-MadTeaParty
  .__march-hare March Hare
```

This would render like

```html
<div class="MadTeaParty">
    <div class="MadTeaParty__march-hare">March Hare</div>
</div>
```

### Modifiers


```jade
.-MadTeaParty
  .__march-hare._type_mad March Hare
  .__march-hare._mad March Hare
```


This would render like

```html
<div class="MadTeaParty">
    <div class="MadTeaParty__march-hare MadTeaParty__march-hare_type_mad">
        March Hare
    </div>
    <div class="MadTeaParty__march-hare MadTeaParty__march-hare_mad">
        March Hare
    </div>
</div>
```


## Usage

```javascript
var posthtml = require('posthtml');

// It is default config
var config = {
  blockPrefix: '-',
  elemPrefix: '__',
  modPrefix: '_',
  modDlmtr: '_',
};

var jade = [
  '.-mad-tea-party',
  '  .__march-hare._type_mad March Hare',
  '  .__hatter._type_mad Hatter',
  '  .__dormouse._state_sleepy Dormouse'
].join('\n')


posthtml()
  .use(require('posthtml-jade')())
  .use(require('posthtml-bem-sugar')(config))
  .use(require('posthtml-bem')())
  .process(jade)
  .then(function (result) {
    console.log(result.html);
  });
```


## With Gulp

```javascript
var gulp = require('gulp'),
    rename = require('gulp-rename'),
    posthtml = require('gulp-posthtml');

gulp.task('default', function () {
  return gulp.src('before.jade')
    .pipe(posthtml([
      require('posthtml-jade')(),
      require('posthtml-bem-sugar')({
        // defaults
        blockPrefix: '-',
        elemPrefix: '__',
        modPrefix: '_',
        modDlmtr: '_',
      }),
      require('posthtml-bem')(),
    ]))
    .pipe(rename('after.html'))
    .pipe(gulp.dest('.'));
});
```
