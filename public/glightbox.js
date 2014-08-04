(function(w) {

  w.glightbox = this;
  var that = this;

  this.DOM = {}
  , this.CONST = { animTime: 300 }
  , this.isUp = false
  , this.isInProgress = false
  , this.images = []
  , this.current;

  this.init = function(target) {
    // enhance jquery
    $.fn.fetchimg = function(src, f) {
      return this.each(function() {
        var i = new Image();
        i.src = src;
        if (f)
          i.onload = f;
        this.appendChild(i);
      });
    }

    // build the dom
    this.DOM.window = $(window);

    this.DOM.overlay = $('<div id="glightbox"></div>').appendTo('body');
    this.DOM.modal = $('<div id="glightbox-modal"></div>').appendTo(this.DOM.overlay);
    this.DOM.imgframe = $('<div id="glightbox-imgframe"></div>').appendTo(this.DOM.modal);
    this.DOM.prev = $('<div id="glightbox-prev" class="glightbox-controls">&lt;</div>').appendTo(this.DOM.imgframe);
    this.DOM.next = $('<div id="glightbox-next" class="glightbox-controls">&gt;</div>').appendTo(this.DOM.imgframe);
    //this.DOM.close = $('<div id="glightbox-close"></div>').appendTo(this.DOM.imgframe);

    this.imgwidth = Math.floor(this.DOM.window.width() * .65);
    this.ratio = target.height() / target.width();
    this.imgheight = Math.floor(ratio * this.imgwidth);

    this.DOM.modal.css({
      width: this.imgwidth + 40,
      height: this.imgheight + 55,
      marginTop: Math.floor((this.imgheight + 40) / -2 ),
      marginLeft: Math.floor((this.imgwidth + 40) / -2 )
    });

    // wire events
    this.DOM.overlay.on('click', this.hideLightBox.bind(this));

    target.each(function() {
      that.images.push(this);
      this.lbox = new img($(this), that.DOM.imgframe, that.images.length);
    }).on('click', this.showLightBox.bind(this))

    this.DOM.prev.on('click', this.prev.bind(this))
    this.DOM.next.on('click', this.next.bind(this))
    //this.DOM.close.on('click', this.close.bind(this))
  }

  this.showLightBox = function(e) {
    e.preventDefault();
    e.stopPropagation();

    this.fetch(e.target);
    this.toggleLightBox();
  }

  this.hideLightBox = function(e) {
    if (!$(e.target).is(this.DOM.overlay) || this.isInProgress)
      return

    this.toggleLightBox();
  }

  this.toggleLightBox = function() {
    if (this.isUp) {
      this.isInProgress = true;
      this.DOM.overlay.animate({ 'opacity': 0 }, this.CONST.animTime);

      setTimeout(function() {
        this.DOM.overlay.hide();
        this.isInProgress = false;
        this.isUp = false;
      }.bind(this), this.CONST.animTime)

    } else {
      this.isInProgress = true;
      this.DOM.overlay.show().animate({ 'opacity': 1 }, this.CONST.animTime);

      setTimeout(function() {
        this.isInProgress = false;
        this.isUp = true;
      }.bind(this), this.CONST.animTime)
    }
  }
  this.fetch = function(target) {
    if (this.current)
      this.current.hide();

    target.lbox.fetch();
    this.current = target.lbox;
  }

  this.prev = function() {
    var prev = this.current.idx === 1 ? this.images.length : this.current.idx - 1;
    prev--;
    this.fetch(this.images[prev])
  }
  this.next = function() {
    var next = this.current.idx === this.images.length ? 0 : this.current.idx;
    this.fetch(this.images[next])
  }
  this.close = function() {

  }

  var img = function(target, parent, idx) {
    this.target = target;
    this.box = $('<div class=".glightbox-imgbox"></div>"').appendTo(parent);
    this.idx = idx;
    this.isLoaded = false;
    this.url = this.target.attr("href");
    this.fetch = function() {
      if (!this.isLoaded) {
        this.hide();
        this.box.fetchimg(this.url, function() {
          $(this.box).find("img").css({height: glightbox.imgheight, width: glightbox.imgwidth})
        }.bind(this))
        this.isLoaded = true;
      }

      this.show();
    }
    this.hide = function() {
      this.box.hide();
      this.box.css({opacity: 0})
    };
    this.show = function() {
      this.box.show();
      this.box.animate({ 'opacity': 1 }, 1000);
    };
  }
})(window);