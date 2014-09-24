# ngColorThief

ngColorThief is a wrapper for the [ColorThief](https://github.com/lokesh/color-thief) library to extract dominant colors and color palettes from images.

**Note:** cross-domain images will not work unless they're served with the correct CORS headers. Furthermore, you need to add the `cross-origin` attribute to image tags for this to work.

## Installation

Install via bower

    bower install angular-colorthief --save

Or just copy the `angular-colorthief.min.js` file to your project. Next, add the module as a dependency to your project:

    angular.module('yourApp', ['ngColorThief'])

## How To

ngColorThief provides a service and a directive. The simplest way to grab colors is to use the directive on an image tag:

    <img ng-src="{{myImage}}" color-thief color-thief-dominant="colors.myDominantColor">

When the image loads, `myDominantColor` will contain an array with the dominant color (eg: `[255, 250, 109]`). You could apply this to the container:

    <div class="container" ng-style="{'background-color': 'rgb('+colors.dominantColor[0]+', '+colors.dominantColor[1]+', '+colors.dominantColor[2]+')'}">
        <img ng-src="{{myImage}}" color-thief color-thief-dominant="colors.myDominantColor">
    </div>

You can also grab a color palette:

    <img ng-src="{{myImage}}" color-thief color-thief-palette="colors.myPalette">

And specify a color count

    <img ng-src="{{myImage}}" color-thief color-thief-palette="colors.myPalette" color-thief-palette-count="4">

The service simply provides an almost direct interface to a colorThief instance:

    app.controller('MyCtrl', function ($colorThief) {
      var image = /*...*/;

      var dominant = $colorThief.getColor(image);
      var palette = $colorThief.getPalette(image);
    });
    
Refer to ColorThief's documentation to know more.

## Global Settings

You can configure global settings via the provider

    app.config(function ($colorThiefProvider) {
      // Set the default quality
      $colorThief.setDefaultQuality(50);

      // Set the default palette color count
      $colorThief.setDefaultColorCount(4);

      // Set wether to return arrays (ColorThief's default) or
      // objects like {r: 242, g: 124, b: 91} (false by default).
      $colorThief.setReturnObjects(true);
    });
    
## Minimizing

The library is minimized using Closure Compiler with the following command

    closure-compiler --js_output_file=angular-colorthief.min.js --compilation_level SIMPLE angular-colorthief.js
    
## Contributing

Pull requests are welcome! Please fork, create a branch and submit a pull request.

## License

MIT License.