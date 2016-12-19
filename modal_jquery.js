const Modal = (($) => {
  const NAME           = 'modal';
  const DATA_KEY       = 'is.modal';
  const EVENT_KEY      = `.${DATA_KEY}`;
  const ESCAPE_KEYCODE = 27;
  const BODY           = $("body");

  const Default = {
    backdrop:       true, // If bakcdrop doesn't need set this value to false
    backdropColor:  "white", // If you want to change backdrop color use this to custom classname
    keyboardEscape: true, // Enable Esc to close modal,set false if you want to diable this feature
    show:           true  // Set true to show modal
  };

  const Event = {
    MOUSEDOWN_DISMISS: `mousedown.dismiss${EVENT_KEY}`,
    CLICK_DISMISS:     `click.dismiss${EVENT_KEY}`,
    KEYDOWN_DISMISS:   `keydown.dismiss${EVENT_KEY}`
  };

  const ClassName = {
    SCROLLBAR_MEASURER: 'scrollbar-measure',
    BACKDROP:           'modal-backdrop',
    OPEN:               'modal-open',
    FADE:               'fade',
    ACTIVE:             'active'
  };

  const Selector = {
    DIALOG:        '.modal-dialog',
    CLOSE_TRIGGER: `[data-closeTrigger="modal"]`
  };

  class Modal {
    constructor(elem, config) {
      this.element              = $(elem); 
      this.backdrop             = null;
      this.dialog               = $(Selector.DIALOG);
      this.isShown              = false;
      this.config               = this._getConfig(config);
      this._originalBodyPadding = 0;
      this._scrollbarWidth      = 0;
    }

    static get Default() {
      return Default;
    }

    show () { // show modal
      this._getScrollbarWidth();
      this._setScrollbarWidthAndClass();
      this.element.css("visibility","visible").addClass(ClassName.ACTIVE).focus();
      this.isShown = true;
      this._showDrop();
      this._setkeyboardEscape();
      this.element.on(
        Event.CLICK_DISMISS,
        Selector.CLOSE_TRIGGER,
        (event) => this.hide(event)
      );
    }

    hide (e) { // hide modal
      this.element.off(Event.MOUSEDOWN_DISMISS);
      this.element.off(Event.CLICK_DISMISS);
      BODY.removeClass(ClassName.OPEN);
      this.element.removeClass(ClassName.ACTIVE);
      this.element.one("transitionend", () => {
        this.element.css("visibility","hidden");
        this._hideDrop();
      });
      this.isShown = false;
      this._setkeyboardEscape();
    }

    _showDrop() { // create backdrop
      if( this.isShown && this.config.backdrop ) {
        this.backdrop = document.createElement('div');
        this.backdrop.className = `${ClassName.BACKDROP} ${ClassName.ACTIVE} ${ClassName.FADE} backdrop-${this.config.backdropColor}`;
        $(this.backdrop).appendTo(document.body);
      }
      this.element.on(Event.MOUSEDOWN_DISMISS, (event) => {
        if ($(event.target).is($(".modal-flex-container"))) {
          this.hide();
        }
      });
    }

    _setkeyboardEscape () { //press Esc to close modal
      if(this.isShown && this.config.keyboardEscape) {
        // if modal is visible and config allow keypress close feature to add KEYDOWN_DISMISS EventListener
        this.element.on(Event.KEYDOWN_DISMISS,(e) => {
          if(e.which === ESCAPE_KEYCODE) {
            this.hide();
          } 
        });
      } else if (!this.isShown) {
        // if modal is invisible to remove KEYDOWN_DISMISS eventListener
        this.element.off(Event.KEYDOWN_DISMISS);
      }
    }

    _hideDrop() { // destory backdrop
      if(this.backdrop) {
        $(this.backdrop).remove();
        this.backdrop = null;
      }  
    }

     // some helper function
     // measure scroll bar width and set body padding when modal been open
    _setScrollbarWidthAndClass() {
      if(document.body.clientWidth < window.innerWidth) {
        BODY.addClass(ClassName.OPEN).css("padding-right",this._scrollbarWidth);
        $(".navbar").css("right",this._scrollbarWidth);
      } else {
        BODY.addClass(ClassName.OPEN);
      }
    }

    _resetScrollbar() {
      document.body.style.paddingRight = this._originalBodyPadding;
      $(".navbar").css("right",0);
    }

    _getScrollbarWidth() { 
      // inspired by d.walsh https://davidwalsh.name/detect-scrollbar-width
      const scrollDiv = document.createElement('div');
      scrollDiv.className = ClassName.SCROLLBAR_MEASURER;
      document.body.appendChild(scrollDiv);
      const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      this._scrollbarWidth = scrollbarWidth;
      return scrollbarWidth;
    }

    // to get config
    _getConfig(config) {
      config = $.extend(
        {},
        Default,
        config);
      return config;
    }

    // Modal instance create function
    static _jQueryInterface(config) {
      return this.each(function () {
        const $this = $(this);
        // cache instace
        let instance = $this.data(DATA_KEY); 

        // combine custom config with default setting
        const _config = $.extend(
          {},
          Modal.Default,
          $this.data(),
          typeof config === 'object' && config
        );

        // if instance no exist, create instance
        if(!instance) { 
          instance = new Modal(this, _config);
          $this.data(DATA_KEY, instance);
        }
        
        // setting config
        if (typeof config === 'string') {
          if (instance[config] === undefined) {
            throw new Error(`No method named "${config}"`);
          }
          instance[config]();
        } else if(config.show){
          instance.show();
        }
      });
    }
  }

  // connect with jquery
  $.fn[NAME] = Modal._jQueryInterface;
  $.fn[NAME].Constructor = Modal;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return Modal._jQueryInterface;
  };

  return Modal;
})(jQuery);