{{ -- tpl:task-add-task-add -- }}
<div class="row">
    <div class="item-title">创建任务</div>
    <div class="row item-body">
        <div class="col-md-12">
            <form class="form-horizontal">
                <div class="form-group">
                    <label class="col-sm-2 control-label">计算类型</label>
                    <div class="col-sm-10 task-selector"></div>
                </div>
                <div class="nav-content">
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-10">
                        <button type="button" class="btn btn-primary add-task">提交</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <div class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">创建任务提示框</h4>
                </div>
                <div class="modal-body">
                    <p class="status-content"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary confirm-task-btn" data-dismiss="modal">确定</button>
                </div>
            </div>
        </div>
    </div>
</div>
{{ -- /tpl -- }}

{{ -- tpl:task-add-task-add-nav-content -- }}
<%
    for (var i = 0, len = _this.conditions.length; i < len; i++) {
        var item = _this.conditions[i];
        var type = item.type;
%>
        <div class="form-group">
            <label for="item-<%= i %>" class="col-sm-2 control-label"><%= item.cname %></label>
            <div class="col-sm-10">
                <%
                    if (type === 'text') {
                %>
                    <input type="text" class="form-control" id="item-<%= i %>" placeholder="<%= item.plchdr %>" name="<%= item.name %>" value="<%= item.val %>"
                    <%
                        if (item.tip) {
                    %>
                        data-toggle="tooltip" data-placement="top" title="<%= item.tip %>" data-html="true"
                    <%
                        }
                    %>
                    >
                <%
                    } else if (type === 'textarea') {
                %>
                        <textarea class="form-control" rows="4" id="item-<%= i %>" placeholder="<%= item.plchdr %>" name="<%= item.name %>" 
                            <%
                                if (item.tip) {
                            %>
                                data-toggle="tooltip" data-placement="top" title="<%= item.tip %>" data-html="true"
                            <%
                                }
                            %>
                        ><%= item.val %></textarea>
                <%
                    } else if (type === 'datehour') {
                %>
                    <input type="text" class="form-control" id="item-<%= i %>" placeholder="<%= item.plchdr %>" name="<%= item.name %>" value="<%= item.val %>" <% filter('datetimepicher', 'item-' + i); %> >
                <%
                    } else if (type === 'select') {
                %>
                    <div style="height: 30px;" id="item-<%= i %>" <% filter('dropdown', 'item-' + i, item); %>></div>
                <%
                    }
                %>
            </div>
        </div>
<%
    }
%>
{{ -- /tpl -- }}