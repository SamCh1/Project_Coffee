module.exports = (limitItems, query, count) =>{
    const objectPagination = {
        currentPage: 1,
        limitItem: limitItems
    };
    if(query.page){
        objectPagination.currentPage = parseInt(query.page);
    }

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;
    objectPagination.totalPage = Math.ceil(count / objectPagination.limitItem);

    return objectPagination;
}

// trang hiện tại = (số trang hiện tại - 1) * số sản phẩm trên 1 trang
// tổng trang = tổng số sản phẩm / giới hạn sản phẩm trên một trang