define(function (require) {
    var Upload = require('../../ui').create({
        bindEvent: function () {
            var me = this;
            this.element.on('click', function () {
                var uploadNode = $('<input type="file"' + (me.accept ? 'accept="' + me.accept + '"' : '') + '/>').trigger('click');
                uploadNode.on('change', function () {
                    if (me.local) {
                        var file = this;
                        var r = new FileReader();
                        r.readAsDataURL(this.files[0]);
                        r.onload = function () {
                            me.fire('selected', this.result, file);
                        }
                    } else {
                        var fd = new FormData();
                        fd.append(this.name || 'file', this.files[0]);
                        $.ajax({
                            url: me.url,
                            type: 'POST',
                            data: fd,
                            dataType: 'json',
                            contentType: false,
                            processData: false
                        }).done(function (resp) {
                            uploadNode.remove();
                            me.fire('upload', resp);
                        }).fail(function (err) {
                            me.fire('error', err);
                        });
                    }
                });
            });
        }
    });
    return Upload;
});