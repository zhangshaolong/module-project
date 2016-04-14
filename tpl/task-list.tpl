{{ -- tpl:task-list-task-list -- }}
    <div class="row task-list">
        <div class="item-title">任务列表</div>
        <div class="row item-body">
            <div class="task-table">
                <table class="table table-hover table-bordered">
                    <thead>
                        <tr>
                            <th>操作</th>
                            <%
                                if (_this.vh) {
                            %>
                                <th>历史id</th>
                            <%
                                }
                            %>
                            <th>任务id</th>
                            <th>创建人</th>
                            <th>任务描述</th>
                            <th>计算模型</th>
                            <th>启动时间</th>
                            <th>结束时间</th>
                            <th>状态</th>
                        </tr>
                    </thead>
                    <tbody class="task-tbody">
                    </tbody>
                </table>
                <div class="pager-container"></div>
            </div>
        </div>
    </div>
{{ -- /tpl -- }}

{{ -- tpl:task-list-task-list-tbody -- }}
    <%
        for (var i = 0, len = _this.list.length; i < len; i++) {
            var item = _this.list[i];
    %>
    <tr>
        <td data-id="<%= item.taskid %>" data-hid="<%= item.historyid %>"><%= filter('getActions', item) %></td>
        <%
            if (_this.vh) {
        %>
            <td><%= item.historyid %></td>
        <%
            }
        %>
        <td><%= item.taskid %></td>
        <td><%= item.owner %></td>
        <td><%= item.descr %></td>
        <td><%= item.compute_name %></td>
        <td><%= filter('dateFormat', item.start_time) %></td>
        <td><%= filter('dateFormat', item.end_time) %></td>
        <td><%= item.status %></td>
    </tr>
    <% } %>
{{ -- /tpl -- }}
