var Product = function(product_id, product_name, department_name, price, stock_quantity) {
    this.product_id = product_id;
    this.product_name = product_name;
    this.department_name = department_name;
    this.price = price;
    this.stock_quantity = stock_quantity;
}

module.exports = {
    Product: Product
}
