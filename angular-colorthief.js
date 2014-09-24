'use strict';

angular.module('ngColorThief', [])
  .provider('$colorThief', [function () {
    /**
     This will hold the global ColorThief instance
     */
    var colorThief = new ColorThief();

    /**
     Holds the default quality set by the user.
     */
    var defaultQuality;

    /**
     Holds the default colorCount set by the user.
     */
    var defaultColorCount;

    /**
     If true, colors will be returned as an object like so:

         {r: 255, g: 200, b: 150}

     Same for arrays (palettes):

         [{r: 255, g: 200, b: 150}, {r: 250, g: 190, b: 150}]

     */
    var returnObjects = false;

    /**
     Will overwrite ColorThief's default quality
     */
    this.setDefaultQuality = function (quality) {
      defaultQuality = quality;
    };

    /**
     Will overwrite ColorThief's default colorCount for the
     palettes calculation.
     */
    this.setDefaultColorCount = function (colorCount) {
      defaultColorCount = colorCount;
    };

    /**
     Will set the returnObjects setting to the passed value
     */
    this.setReturnObjects = function (setting) {
      returnObjects = setting;
    };

    /**
     Public service API
     */
    this.$get = [function () {
      function mapColor(color) {
        if ( ! returnObjects) {
          return color;
        }

        return {
          r: color[0],
          g: color[1],
          b: color[2]
        };
      }

      return {
        getColor: function (image, quality) {
          return mapColor(colorThief.getColor(image, quality || defaultQuality));
        },

        getPalette: function (image, colorCount, quality) {
          var colors = colorThief.getPalette(image, colorCount || defaultColorCount, quality || defaultQuality);

          for (var i = colors.length - 1; i >= 0; i--) {
            colors[i] = mapColor(colors[i]);
          };

          return colors;
        }
      };
    }];
  }])

  /**
   Apply this directive to an IMG tag and supply a variable name where
   the color palette will be set. For example:

       <img ng-src="{{mySrc}}" color-thief color-thief-dominant="myDominantColor">

   This will calculate the dominant color of the image and set it to the myColor variable on
   the scope.

   If you want an 8 color palette, add a colorThiefPallette directive, like so:

       <img ng-src="{{mySrc}}" color-thief color-thief-palette="myPalette" color-thief-palette-count="8">

   colorThiefPaletteCount is 8 by default, so there's no need to define it if you need 8 colors.

   Note: a color count of 1 is not valid and will throw an error.
   */
  .directive('colorThief', ['$parse', '$colorThief', function ($parse, $colorThief) {
    return {
      restrict: 'A',
      scope: {
        dominant: '=colorThiefDominant',
        palette: '=colorThiefPalette'
      },
      link: function (scope, element, attrs) {
        if (angular.uppercase(element[0].tagName) !== 'IMG') {
          throw new Error('The colorThief directive has to be applied to an IMG tag.');
        }

        // Allow configuring the image to retrieve CORS-enabled images.
        if (angular.isDefined(attrs.crossorigin) || angular.isDefined(attrs.crossOrigin)) {
          element[0].crossOrigin = attrs.crossorigin || attrs.crossOrigin || 'Anonymous';
        }

        // Set it to undefined by default to allow the provider's default count overwrite this if needed
        var paletteCount = attrs.colorThiefPaletteCount ? $parse(attrs.colorThiefPaletteCount)() : undefined;

        // Everytime the image loads, calculate the colors again
        element.on('load', function () {
          scope.$apply(function () {
            if (attrs.colorThiefDominant) {
              scope.dominant = $colorThief.getColor(element[0]);
            }

            if (attrs.colorThiefPalette) {
              scope.palette = $colorThief.getPalette(element[0], paletteCount);
            }
          });
        });
      }
    };
  }]);
