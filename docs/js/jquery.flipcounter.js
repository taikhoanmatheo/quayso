

;(function ( $, window, document, undefined ) {
    
    // Create the defaults once
    var pluginName = 'flipCounter',
        defaults = {
            speed: 0.2,
            onFlip: function() {},
            onResize: function() {}
        };

    // Constructor
    function FlipCounter( element, options ) {
        this.element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    FlipCounter.prototype.init = function () {
        var elem = this.element;
        var startNum = elem.html();
        if (startNum == "") startNum = "0";
        elem.html('<ul class="flipcounter"></ul>');
        
        this.ul = elem.children('ul');
        this.ulWidth = 0;
        this.digits = new Array();

        for (i=startNum.length-1; i>=0; i=i-1)
        {
            this.addDigit(startNum[i]);
        }
    };
    
    FlipCounter.prototype.addDigit = function (num) {
        // Add separator after every 3rd digit
        // if (this.digits.length % 4 == 0 && this.digits.length != 0)
        // {
        //     this.addSeparator();
        // }
        
        this.ul.prepend('<li>\
            <div class="numberwrap">\
                <div class="flipper_top flipper_top1"></div>\
                <div class="flipper_top flipper_top2 flipper_top_back">\
                    <span class="num">'+num+'</span>\
                </div>\
                <div class="flipper_top flipper_top_front">\
                    <span class="num">'+num+'</span>\
                </div>\
                <div class="flipper_bottom flipper_bottom1 flipper_bottom_back">\
                    <span class="num">'+num+'</span>\
                </div>\
                <div class="flipper_bottom flipper_bottom_front">\
                    <span class="num">'+num+'</span>\
                </div>\
                <div class="rings"></div>\
            </div>\
        </li>');
        
        var li = this.ul.find('li:first-child');
        var digit = new Digit(li, num);
        digit.manager = this;
        this.digits.push(digit);
        
        // Update width
        this.ulWidth = this.ulWidth + digit.li.outerWidth(true);
        this.ul.css('min-width', this.ulWidth);
        this.ul.css('min-height', digit.li.outerHeight(true));
    };
    
    FlipCounter.prototype.removeDigit = function () {
        var digit = this.digits.splice(this.digits.length-1, 1)[0];
        this.ulWidth = this.ulWidth - digit.li.outerWidth(true);
        digit.li.remove();
        
        // Remove separators
        if (this.digits.length % 4 == 0)
        {
            var comma = this.ul.find('li.comma:first-child');
            this.ulWidth = this.ulWidth - comma.outerWidth(true);
            comma.remove();
        }
        
        // Update width to current
        this.ul.css('min-width', this.ulWidth);
    }
    
    FlipCounter.prototype.addSeparator = function (num) {
        this.ul.prepend('<li class="comma"> </li>'); //bamt mod
        
        // Update width
        var comma = this.ul.find('li.comma:first-child');
        this.ulWidth = this.ulWidth + comma.outerWidth(true);
        this.ul.css('min-width', this.ulWidth);
    };
    FlipCounter.prototype.set = function (num) {
        var numStr = num.toString();//parseInt(num).toString(); //bamt mod
        for (i=0; i<numStr.length; i=i+1)
        {
            this.digits[i].set(numStr[numStr.length - 1 - i]);
        }
    }
    FlipCounter.prototype.updateTo = function (num) {
        var numStr = num.toString();//parseInt(num).toString(); //bamt mod
		numStr = numStr.toUpperCase();
        // Change the number of digits displayed if needed
        if (numStr.length != this.digits.length)
        {
            //console.log("num digit change");
			//return;
            var diff = numStr.length - this.digits.length;
            if (diff > 0)
            {
                for (i=0; i<diff; i=i+1) {
                    this.addDigit(0);
                }
            }
            else
            {
                for (i=diff; i<0; i=i+1) {
                    this.removeDigit();
                }
            }
            
            this.options['onResize']();
        }
        
        // Change all digit values
        for (i=0; i<numStr.length; i=i+1)
        {
            this.digits[i].flipTo(numStr[numStr.length - 1 - i]);
        }
    };

    function Digit( element, currentChar ) {
        //bamt: currentChar = parseInt(currentChar);
        this.chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','R','S','T','U','V','X','Y','W'];
        this.li = $(element);
        this.topFrontDiv = this.li.find('.flipper_top_front');
        this.bottomFrontDiv = this.li.find('.flipper_bottom_front');
        this.topNumBack = this.li.find('.flipper_top_back span');
        this.topNumFront = this.li.find('.flipper_top_front span');
        this.bottomNumBack = this.li.find('.flipper_bottom_back span');
        this.bottomNumFront = this.li.find('.flipper_bottom_front span');

        this.currentIndex = 0;
        this.targetChar = currentChar;
        this.currentChar = currentChar;
        this.nextChar = currentChar;

        this.currentlyAnimating = false;
    }

    Digit.prototype.flipTo = function (char) {
        //console.log("flipTo: "+num);
        if (this.currentChar == char)
            return;

        this.targetChar = char;
        if (this.currentlyAnimating)
            return;

        this.animNext();

    };
    Digit.prototype.set = function (char) {
        this.currentChar = char;
        this.topNumBack.html(this.currentChar);
        this.topNumFront.html(this.currentChar);
        this.bottomNumBack.html(this.currentChar);
        this.bottomNumFront.html(this.currentChar);

    };
    Digit.prototype.animNext = function () {

        if (this.currentChar == this.targetChar)
        {
            this.currentlyAnimating = false;
            return;
        }

        var doRandomDelay = !this.currentlyAnimating;
        this.currentlyAnimating = true;
        this.currentIndex++;
        if (this.currentIndex >= this.chars.length) {
            this.currentIndex = 0;
        }
        this.nextChar = this.chars[this.currentIndex]; // add
        var delay = Math.random()/5;
        if (!doRandomDelay) delay = 0.01;

        // Animate top flipper
        var digit = this;
        digit.topNumBack.html(digit.nextChar);
        digit.topFrontDiv.tween({
            transform: {
                start: 'scaleY(1)',
                stop: 'scaleY(0)',
                time: delay,
                duration: this.manager.options.speed,
                units: '',
                effect: 'easeIn'
            }
        }).play();

        // Animate bottom flipper with delay
        digit.bottomFrontDiv.tween({
            transform: {
                start: 'scaleY(0)',
                stop: 'scaleY(1)',
                time: delay + this.manager.options.speed,
                duration: this.manager.options.speed * 0.5,
                units: '',
                effect: 'easeOut',
                onStart: function() {
                    digit.bottomNumFront.html(digit.nextChar);
                },
                onStop: function() {
                    digit.currentChar = digit.nextChar;
                    digit.topNumFront.html(digit.currentChar);
                    digit.topFrontDiv.removeAttr('style', '');
                    digit.bottomNumBack.html(digit.currentChar);
                    digit.animNext();
                    digit.manager.options['onFlip']();
                }
            }
        }).play();
    }

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName+'Init'] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new FlipCounter( this, options ));
            }
        });
    }
        
    $.fn[pluginName+'Update'] = function ( num ) {
        return this.each(function () {
            var obj = $.data(this, 'plugin_' + pluginName);
            if (obj) {
                obj.updateTo(num);
            }
        });
    }
    $.fn[pluginName+'Set'] = function ( num ) {
        return this.each(function () {
            var obj = $.data(this, 'plugin_' + pluginName);
            if (obj) {
                obj.set(num);
            }
        });
    }

})( jQuery, window, document );