const {
    GOODS_LIST,
    GOODS_DETAIL,
    GOODS_EDIT,
    GOODS_NEW,} = require('./routerConst');

const goodsRouterHandle = (req, res)=>{
    if(req.method === 'get' && req.path === GOODS_LIST){
        // 处理商品列表
    }else if(req.method === 'get' && req.path === GOODS_DETAIL){
        // 处理商品详情
    }else if(req.method === 'get' && req.path === GOODS_EDIT){
        // 处理编辑商品
    }else if(req.method === 'post' && req.path === GOODS_NEW){
        // 处理新建商品
    }
}
module.exports = goodsRouterHandle;