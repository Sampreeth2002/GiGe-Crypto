pragma solidity >=0.4.21 <0.6.0;

library ProductLib {
   struct Product {
      uint id; 
      string productName;
      address owner;
      address payable seller;
      string imageUrl1;
      string imageUrl2;
      string description;
      string location;
      uint price;
   }

   struct Data {
      mapping(uint => Product) products;
      uint totalProducts;
   }

   modifier isWithinBounds(uint _size, uint _idx) {
      require(_size > _idx, "Invalid Product Id specified");
      _;
   }

   modifier compareAddress(address owner, bool shouldBeSame) {
      require((owner == msg.sender) == shouldBeSame, "Seller can not buy his own Product");
      _;
   }

   modifier isNotBought(Product memory _product) {
      require(_product.owner == _product.seller, "Product has already been bought");
      _;
   }

   function fetch(Data storage self, uint _productId) public view 
   isWithinBounds(self.totalProducts, _productId)
   returns(
      uint id, 
      string memory productName,
      address owner,
      address payable seller,
      string memory imageUrl1,
      string memory imageUrl2,
      string memory description,
      string memory location,
      uint price
   ) {
      Product memory _product = self.products[_productId];
      return (
         _product.id,
         _product.productName,
         _product.owner,
         _product.seller,
         _product.imageUrl1,
         _product.imageUrl2,
         _product.description,
         _product.location,
         _product.price
      );
   }

   function addToSell(
      Data storage self, 
      string memory _productName,
      string memory _imageUrl1,
      string memory _imageUrl2,
      string memory _description,
      string memory _location,
      uint _price
   ) public {
      self.products[self.totalProducts] = Product({
         id: self.totalProducts,
         productName: _productName,
         owner: msg.sender,
         seller: msg.sender,
         imageUrl1: _imageUrl1,
         imageUrl2: _imageUrl2,
         description: _description,
         location: _location,
         price: _price
      });
      ++self.totalProducts;
   }

   function update(
      Data storage self, 
      uint _id, 
      string memory _productName,
      string memory _imageUrl1,
      string memory _imageUrl2,
      string memory _description,
      string memory _location,
      uint _price
   ) public 
   isWithinBounds(self.totalProducts, _id) 
   compareAddress(self.products[_id].seller, true) 
   isNotBought(self.products[_id]) {
      self.products[_id] = Product({
         id: _id,
         productName: _productName,
         owner: msg.sender,
         seller: msg.sender,
         imageUrl1: _imageUrl1,
         imageUrl2: _imageUrl2,
         description: _description,
         location: _location,
         price: _price
      });
   }

   function getToBuy(Data storage self, uint _id) public 
   isWithinBounds(self.totalProducts, _id)
   compareAddress(self.products[_id].seller, false) 
   isNotBought(self.products[_id]) {
      self.products[_id].owner = msg.sender;
   }
}
