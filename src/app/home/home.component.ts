import { Component, OnInit } from '@angular/core';
import { ApiServiceService, Cart, Product, Transaction } from '../api-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  cart: Cart;
  countProduct:number;
  totalPrice:number;

  constructor(private apiService: ApiServiceService) {}

  ngOnInit(): void {
    this.refreshProduct();
    this.getCart();
  }
    //refresh array products 
    refreshProduct() {
      this.apiService.getProducts().subscribe((data) => {
        this.products = data;
      })
    }

   createNewCart(product:Product){
    
    //alert(product.title +"\n"+ product.price +"\n"+ product.description +"\n"+ product.image);
    const cart:Cart = {
      products:[
        {
          serialNumber: product.serialNumber,
          title: product.title,
          price: product.price,
          amount: 1
        }
      ],
      serialNumberCart:0,
      total: product.price
    }
    this.totalPrice = product.price;
     this.apiService.addToCart(cart).subscribe((data) => {
        //console.log(data);
        this.ngOnInit();
    })
}


getCart(){

  this.apiService.getCountCart().subscribe((data) => {
  //console.log(typeof data);
  if(data > 0){
    //console.log('push' + data);
    this.apiService.getCarts().subscribe((data) => {
    let tempCart:Cart = {
      products:data[0].products,
      serialNumberCart:data[0].serialNumberCart,
      total: data[0].total
    }
    this.cart = tempCart;
    this.countProduct = this.cart.products.length;
    this.totalPrice = 0;
    for(let item of this.cart.products)
          this.totalPrice += Number(item.price);
    this.cart.total = this.totalPrice;
    this.updateTotal();
    // console.log(this.totalPrice);
    // console.log(this.cart.total);
  })
  }else{
    //console.log('create new one'+ data);
  }
  })
 
}


pushToCart(product:Product){
  this.apiService.getCountCart().subscribe((data) => {
    if(data > 0) {
      this.apiService.pushToCart(product, this.cart.serialNumberCart).subscribe((data) => {
        //console.log(data);
        // console.log('total price of cart: '+this.cart.total);
        // console.log('total price: '+this.totalPrice);
        this.ngOnInit();
      })
    }
    else{
      this.createNewCart(product);
      this.ngOnInit();
    }
  })
}

emptyCart(){
  this.apiService.emptyCart().subscribe((data) => {
    //console.log(data);
  })
  this.cart = null;
}


updateTotal(){
  //console.log(this.totalPrice);
  try{
    this.apiService.setTotal(this.totalPrice, this.cart.serialNumberCart).subscribe((data) => {
      //console.log('Update Total successfuly');
    })
  }catch(error){
    console.log('set total error - client side');
  }
}

  createTaransaction(){
 //console.log(this.totalPrice);
 try{
  this.apiService.setTotal(this.totalPrice, this.cart.serialNumberCart).subscribe((data) => {
    //console.log('Update Total successfuly');
    this.buildTaransaction();
  })
}catch(error){
  console.log('set total error - client side');
}
  
  }

  buildTaransaction(){
    let tempTransaction:Transaction = {
      cart:this.cart,
      date:new Date()
    }
    //console.log(tempTransaction.cart.total);
    this.apiService.addToHistory(tempTransaction).subscribe((data) => {
      //console.log(data)
    })
    this.emptyCart();
  }

 


  /* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
 myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
} 

}
