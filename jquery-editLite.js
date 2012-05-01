(function ($, undefined) {

    $.widget("SP.editLite", {
        version: 0.1,
        options: {
            type: 'text',
            trigger: 'click',
            onblur: 'submit',
            submit: null
        },

        _create: function () {
            this.element.on(this.options.trigger, $.proxy(this.edit, this));
        },

        _init: function () {
            if (this.options.autoEdit) {
                this.edit();
            }
        },
        edit: function () {
            this.element.hide();
            this.classes = this.element.prop('class');
            this.oldContent = this.element.text();
            this.inputElement = $('<input type="text" class="' + this.classes + '" />').attr({
                value: this.oldContent
            }).insertAfter(this.element).select().on('blur keydown', $.proxy(this._save, this));
            return this;
        },

        _save: function (e) {
            if (e.type === 'blur' || (e.which === 13 && !e.shiftKey)) {
                e.preventDefault();
                this.newContent = this.inputElement.val();
                if (this.newContent !== this.oldContent) {
                    this.inputElement.remove();
                    this.savingElement = this.element.clone().text('Saving...').insertAfter(this.element).show();
                    this._initSubmit();
                    this.submit(this.newContent, this._response());
                } else {
                    this.inputElement.remove();
                    this._render(this.newContent);
                }
            }
        },

        _render: function (content) {
            if (this.savingElement) {
                this.savingElement.remove();
            }
            this.element.text(content).show();
        },

        _initSubmit: function (content, element, callback) {
            if ($.isFunction(this.options.submit)) {

                this.submit = this.options.submit;
            } else {
                this.submit = function (content, display) {
                    display(content);
                };
            }
        },

        _response: function () {
            var that = this;
            return function (content) {
                that._render(content);
            };
        },

        _setOption: function (key, value) {
            this.options[key] = value;

            switch (key) {
            case "submit":
                this._initSubmit();
                break;
            }
            // In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget
            $.Widget.prototype._setOption.apply(this, arguments);
            // In jQuery UI 1.9 and above, you use the _super method instead
            //this._super( "_setOption", key, value );
        },

        destroy: function () {
            // In jQuery UI 1.8, you must invoke the destroy method from the base widget
            $.Widget.prototype.destroy.call(this);
            // In jQuery UI 1.9 and above, you would define _destroy instead of destroy and not call the base method
        }
    });
}(jQuery));