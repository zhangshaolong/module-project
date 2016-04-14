{{ -- tpl:product-add-product-form -- }}
    <form class="form-horizontal">
        <div class="form-group">
            <label for="product-name" class="col-sm-2 control-label">业务线名称</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="product-name" placeholder="请输入业务线名称" value="<%= _this.productName %>" name="productName" data-validate-name="productName" maxlength="40">
                <div class="validator-error"></div>
            </div>
        </div>
        <div class="form-group">
            <label for="owner" class="col-sm-2 control-label">接口人</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="owner" placeholder="请输入接口人姓名" value="<%= _this.owner %>" name="owner" data-validate-name="owner" maxlength="40">
                <div class="validator-error"></div>
            </div>
        </div>
        <div class="form-group">
            <label for="owner-phone" class="col-sm-2 control-label">手机号</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="owner-phone" placeholder="请输入接口人手机" value="<%= _this.ownerPhone %>" name="ownerPhone" data-validate-name="ownerPhone" maxlength="20">
                <div class="validator-error"></div>
            </div>
        </div>
        <div class="form-group">
            <label for="owner-email" class="col-sm-2 control-label">邮箱</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="owner-email" placeholder="请输入接口人邮箱" value="<%= _this.ownerMail %>" name="ownerMail" data-validate-name="ownerMail" maxlength="100">
                <div class="validator-error"></div>
            </div>
        </div>
        <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
                <button type="button" class="btn btn-primary product-save" name="productId" value="<%= _this.productId %>">确定</button>
                <button type="button" class="col-sm-offset-1 btn btn-default cancel-save">取消</button>
            </div>
        </div>
    </form>
{{ -- /tpl -- }}