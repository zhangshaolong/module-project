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
                        me.fire('beforeUpload');
                        var file = this.files[0];
                        var name = me.name || 'file';
                        if (me.slice) {
                            var uploadSliceFile = function (index) {
                                var size = file.size;
                                var sliceSize = 20 * 1024 * 1024;
                                var totalSlice = Math.ceil(size / sliceSize);
                                var start = index * sliceSize;
                                var end = Math.min(size, start + sliceSize); 
                                var fd = new FormData();
                                fd.append('data', file.slice(start, end));
                                fd.append('lastModified', file.lastModified);
                                fd.append('name', name);
                                fd.append('total', totalSlice);
                                fd.append('index', index || 0);
                                $.ajax({
                                    url: me.url,
                                    type: 'POST',
                                    data: fd,
                                    dataType: 'json',
                                    contentType: false,
                                    processData: false
                                }).done(function (resp) {
                                    if (index + 1 < totalSlice) {
                                        uploadSliceFile(index + 1);
                                    } else {
                                        me.fire('upload', resp);
                                    }
                                }).fail(function (err) {
                                    me.fire('error', err);
                                });
                            };
                            uploadSliceFile();
                        } else {
                            var fd = new FormData();
                            fd.append(name, file);
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
                    }
                });
            });
        }
    });
    return Upload;
});