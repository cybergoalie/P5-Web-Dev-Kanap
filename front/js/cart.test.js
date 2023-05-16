const {Cart}= require('./cart')
  
  /**
   * Test suite for the `addToCart` method of the Cart class.
   * @memberof module:Cart
   */
  describe('Cart', () => {
  
    describe('addToCart', () => {
      /**
     * Test case for adding a product to the cart.
     * @memberof module:Cart.addToCart
     * @test
     */
      it('should add a product to the cart', () => {
        // Create a new instance of the Cart class
        const cart = new Cart();
        // Define a product
        const product = { id: 1, name: 'Product 1', price: 10 };
        // Define the expected cart items after adding the product
        const expectedCartItems = [{ ...product, quantity: 1 }];
      // Call the addToCart method to add the product to the cart
        cart.addToCart(product);
      // Perform the assertion to check if the cart items match the expected items
        expect(cart.items).toEqual(expectedCartItems);
      });
    /**
     * Test case for increasing the quantity of a product if it already exists in the cart.
     * @memberof module:Cart.addToCart
     * @test
     */
      it('should increase the quantity of a product if it already exists in the cart', () => {
        // Create a new instance of the Cart class
        const cart = new Cart();
        // Define a product
        const product = { id: 1, name: 'Product 1', price: 10 };
        // Define the expected cart items after adding the product multiple times
        const expectedCartItems = [{ ...product, quantity: 2 }];
        // Call the addToCart method multiple times to add the product to the cart
        cart.addToCart(product);
        cart.addToCart(product);
      // Perform the assertion to check if the cart items match the expected items
        expect(cart.items).toEqual(expectedCartItems);
      });
    });
  /**
   * Test suite for the `removeFromCart` method of the Cart class.
   * @memberof module:Cart
   */
    describe('removeFromCart', () => {
      it('should remove a product from the cart', () => {
        const cart = new Cart();
        const product1 = { id: 1, name: 'Product 1', price: 10 };
        const product2 = { id: 2, name: 'Product 2', price: 20 };
        cart.addToCart(product1);
        cart.addToCart(product2);
        const expectedCartItems = [{ ...product2, quantity: 1 }];
  
        cart.removeFromCart(product1);
  
        expect(cart.items).toEqual(expectedCartItems);
      });
  
      it('should decrease the quantity of a product if it already exists in the cart', () => {
        const cart = new Cart();
        const product = { id: 1, name: 'Product 1', price: 10 };
        const expectedCartItems = [{ ...product, quantity: 1 }];
  
        cart.addToCart(product);
        cart.addToCart(product);
        cart.removeFromCart(product);
  
        expect(cart.items).toEqual(expectedCartItems);
      });
  
      it('should remove the product from the cart if its quantity becomes zero after removal', () => {
        const cart = new Cart();
        const product = { id: 1, name: 'Product 1', price: 10 };
        const expectedCartItems = [];
  
        cart.addToCart(product);
        cart.removeFromCart(product);
  
        expect(cart.items).toEqual(expectedCartItems);
      });
    });
  });