import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  products: Product[] = [];
  baseURL: string = 'http://localhost:8000/api/';
  headers = { 'content-type': 'application/json' };
  constructor(private http: HttpClient) { }

  //function Products
  getProducts(): Observable<any> {
    return this.http.get(this.baseURL + 'products/getProducts');
  }

  deleteProduuct(serialNumber:Number):Observable<any>{
    return this.http.delete(this.baseURL + 'products/delete/'+serialNumber);
  }

  createProduct(product:Product):Observable<any>{
    let body = JSON.stringify(product);
    return this.http.post(this.baseURL + 'products/create', body, {
      headers: this.headers,
    });
  }

  updateProduct(product:Product):Observable<any>{
    let body = JSON.stringify(product);
    return this.http.put(this.baseURL + 'products/update/'+product.serialNumber, body, {
      headers: this.headers,
    });
  }
 //function Cart
  createCart(cart:Cart):Observable<any>{
    let body = JSON.stringify(cart);
    return this.http.post(this.baseURL + 'cart/createCart', body, {
      headers:this.headers,
    })
  }

  getCarts(): Observable<any> {
    return this.http.get(this.baseURL +'cart/getCarts');
  }

  pushToCart(product:Product, serialNumberCart:Number){
    let body = JSON.stringify(product);
    //console.log(serialNumberCart);
    return this.http.put(this.baseURL + 'cart/addToCart/'+serialNumberCart, body, {
      headers: this.headers,
    })
  }

  setTotal(t:number,serialNumberCart:Number){
    var obj = {
      total:t
    }
    let body = JSON.stringify(obj);
    //console.log(body)
    return this.http.put(this.baseURL +'cart/setTotal/'+serialNumberCart, body, {
      headers: this.headers,
    })
  }

  addToCart(cart: Cart){
      let body = JSON.stringify(cart);
      return this.http.post(this.baseURL + 'cart/createCart', body, {
        headers: this.headers,
      });
  }

  emptyCart(){
    //need to check this 
    //this.addToHistory(cart);
    return this.http.delete(this.baseURL +'cart/emptyCart');
  }

  getCountCart():Observable<any>{
    return this.http.get(this.baseURL+'cart/countCart');
  }

  //function transaction
  getHistory(): Observable<any> {
    return this.http.get(this.baseURL + 'history/getHistory');
  }

  addToHistory(transaction: Transaction){
    let body = JSON.stringify(transaction);
    return this.http.post(this.baseURL + 'history/createTransaction', body, {
      headers: this.headers,
    });
  }

  countTransaction():Observable<any>{
    return this.http.get(this.baseURL+'history/countTransaction');
  }

  getFiveDays():Observable<any>{
    return this.http.get(this.baseURL + 'history/getFiveDays');
  }
  
}

export class Product {
  serialNumber:Number;
  title: string;
  price: number;
  description: string;
  image:string;
}
export class Cart {
  products: [{ 
    serialNumber:Number,
    title: string
    price: number,
    amount:number
  }]
  total: Number;
  serialNumberCart:Number;
}
export class Transaction {
  cart:Cart
  date:Date;
}