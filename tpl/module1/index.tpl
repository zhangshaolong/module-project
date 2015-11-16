{{ -- tpl:module1-index-sub -- }}
<div>
    用户名：<%= _this.name %>
</div>
<table class="table">
    <thead>
        <tr>
            <th class="width-126">日期</th>
            <th>浏览量</th>
            <th>消耗学分</th>
            <th>推广增量</th>
        </tr>
    </thead>
    <tbody>
        <% var tmp; %>
        <% for(var i = 0, len = _this.list.length ; i < len; i++){ tmp = _this.list[i]; %>
        <tr>
            <td>
                <%= tmp.date %>
            </td>
            <td><%= (tmp.natureFlow + tmp.tgFlow) %></td>
            <td><%= tmp.scoreCost %></td>
            <td class="text-highlight">
                <%= tmp.tgFlow %>
            </td>
        </tr>
        <% } %>
    </tbody>
</table>
<div data-module-path="module1/sub2"></div>
{{ -- /tpl -- }}

{{ -- tpl:module1-index-sub2 -- }}
<div>
    这个是子模块2
</div>
<% include('module1-index-sub2-include') %>
{{ -- /tpl -- }}

{{ -- tpl:module1-index-sub2-include -- }}
<p>
    通过include传递参数<%= _this %>
</p>
{{ -- /tpl -- }}