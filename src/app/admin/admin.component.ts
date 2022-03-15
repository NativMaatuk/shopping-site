import { Component, OnInit } from '@angular/core';
import { ApiServiceService, Product } from '../api-service.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  products:Product []= [];
  constructor(private apiService: ApiServiceService) { }

  ngOnInit(): void {
    this.refreshProduct();
  }

  //refresh array products 
  refreshProduct() {
    this.apiService.getProducts().subscribe((data) => {
      this.products = data;
    })
  }

  onSubmit(productForm, id){
    //console.log(id);
    //console.log(productForm.value)
    if(productForm.value.title == "" ||
       productForm.value.price == "" || 
       productForm.value.description == "" || 
       productForm.value.image == ""){
        alert('ERROR: invalid input, one or more input was empty !\nplease try again.');
        return;
    }
    if(productForm.value.description.length > 20){
      alert('ERROR: max characters is 20 !\nplese try again.');
      return;
    }
      
      let tempProduct:Product = {
        serialNumber:this.products[id].serialNumber,
        title:productForm.value.title,
        price:productForm.value.price,
        description: productForm.value.description,
        image:productForm.value.image
      };  

      this.apiService.updateProduct(tempProduct).subscribe((data) => {
        this.ngOnInit();
      })
      
    //}else{
     // alert('ERROR: canot find this product !\nplease try again');
    //}
  }

  isExist(title):boolean{
    let flag = false;
    for(let product of this.products){
      if(title == product.title)
        flag = true;
    }
    return flag;
  }

  showForm(id: string){
    if(document.getElementById(id).style.display == "none")
        document.getElementById(id).style.display = 'block';
    else
        document.getElementById(id).style.display = 'none';
  }

  deleteProduct(id){
    if(window.confirm('Are sure you want to delete this Product ?'+this.products[id].title)){
      this.apiService.deleteProduuct(this.products[id].serialNumber).subscribe((data) => {
        //console.log(data);
      })
      alert('Delete product successfuly !');
      this.ngOnInit();
    }
  }
  showAddProduct(){
    if(document.getElementById('showAddProduct').style.display == 'block'){
      document.getElementById('showAddProduct').style.display = 'none';
      document.getElementById('AddProductForm').style.display = 'block';
    }
    else if(document.getElementById('showAddProduct').style.display == 'none'){
      document.getElementById('showAddProduct').style.display = 'block';
      document.getElementById('AddProductForm').style.display = 'none';
    }
  }
  addProduct(addProductForm){
    if(addProductForm.value.title == "" ||
    addProductForm.value.price == "" || 
    addProductForm.value.description == "" || 
    addProductForm.value.image == ""){
     alert('ERROR: invalid input, one or more input was empty !\nplease try again.');
     return;
   }
    let tempProduct:Product = {
      serialNumber: 0,
      title:addProductForm.value.title,
      price:addProductForm.value.price,
      description: addProductForm.value.description,
      image:addProductForm.value.image
    };  
    this.apiService.createProduct(tempProduct).subscribe((data) => {
      this.showAddProduct();
      this.ngOnInit();
    })

  }
}
