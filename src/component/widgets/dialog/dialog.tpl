{{ -- tpl: dialog-template -- }}
    <div class="modal{{ _this.nofade ? '' : ' fade' }}{{ _this.cls ? ' ' + _this.cls : '' }}">
        <div class="modal-dialog"{{ _this.width ? ' style="width:' + _this.width + 'px;"' : '' }}>
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">{{ _this.title }}</h4>
                </div>
            <div class="modal-body">
                {{ _this.content }}
            </div>
            <%
                var len = _this.actions && _this.actions.length;
                if (len) {
            %>
                <div class="modal-footer">
                    <%
                        for (var i = 0; i< len; i++) {
                            var type = _this.actions[i];
                        %>
                            <button type="button"
                            <%
                                if (type === 'cancel') {
                            %>
                                class="btn btn-default cancel" data-dismiss="modal"
                            <%
                                } else {
                            %>
                                    class="btn btn-primary ok"
                            <%
                                }
                            %>
                            >{{ _this.buttons[type].text }}</button>
                        <%
                            }
                    %>
                </div>
            <% } %>
        </div>
    </div>
</div>
{{ -- /tpl -- }}