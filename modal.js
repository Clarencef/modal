var Dialog = function Dialog(dialogElem, overlayElem) {
    this.dialogElem = dialogElem;
    this.overlayElem = overlayElem;
    this.focusableEls;
    this.firstFocusableEl;
    this.lastFocusableEl;
}

Dialog.prototype = {
    setDialogFocusEl: function() {
        this.focusableEls = [].slice.call(this.dialogElem.querySelectorAll('a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),[tabindex="0"]'));
        this.firstFocusableEl = this.focusableEls[0];
        this.lastFocusableEl = this.focusableEls[this.focusableEls.length - 1];
    },
    _handleKeyDown: function(e) {
        var DialogContext = this;
        var keyTab = 9;
        var keyEsc = 27;

        function handleBackWard() {
            if (document.activeElement === DialogContext.firstFocusableEl) {
                e.preventDefault();
                DialogContext.lastFocusableEl.focus();
            }
        }

        function handleForward() {
            if (document.activeElement === DialogContext.lastFocusableEl) {
                e.preventDefault();
                DialogContext.firstFocusableEl.focus();
            }
        }

        switch (e.keyCode) {
            case keyTab:
                if (DialogContext.focusableEls.length === 1) {
                    e.preventDefault();
                    break;
                }
                if (e.shiftKey) {
                    handleBackWard();
                } else {
                    handleForward();
                }
                break;
            case keyEsc:
                DialogContext.closeDialog();
                break;
            default:
                break;
        }
    },
    openDialog: function() {
        var DialogContext = this;
        this.dialogElem.removeAttribute('aria-hidden');
        this.overlayElem.removeAttribute('aria-hidden');
        this.focusedElBeforeOpen = document.activeElement;
        this.dialogElem.addEventListener('keydown', function(e) {
            DialogContext._handleKeyDown(e);
        })
        this.firstFocusableEl.focus();
    },
    closeDialog: function() {
        this.dialogElem.setAttribute('aria-hidden', true);
        this.overlayElem.setAttribute('aria-hidden', true);
        if (this.focusedElBeforeOpen) {
            this.focusedElBeforeOpen.focus();
        }
    },
    addEvent: function(openEls, closeEls) {

        var DialogContext = this;
        var openDialogEls = document.querySelectorAll(openEls);
        var closeDialogEls = document.querySelectorAll(closeEls);

        for (var i = 0, len = openDialogEls.length; i < len; i++) {
            openDialogEls[i].addEventListener('click', function() {
                DialogContext.openDialog();
            });
        }

        for (var i = 0, len = closeDialogEls.length; i < len; i++) {
            closeDialogEls[i].addEventListener('click', function() {
                DialogContext.closeDialog();
            });
        }

        this.overlayElem.addEventListener('click', function () {
            DialogContext.closeDialog();
        })
    },
    consoleDialog: function() {
        console.log(this.dialogElem);
        console.log(this.overlayElem);
    }
}