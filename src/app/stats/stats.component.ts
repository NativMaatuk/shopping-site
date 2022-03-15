import {
  Component,
  OnInit,
  Type
} from '@angular/core';

import {
  ApiServiceService,
  Cart,
  Product,
  Transaction
} from '../api-service.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})

export class StatsComponent implements OnInit {
  fiveDaysTransaction: any[] = [];
  topFiveSell: any[] = [];
  products: Product[] = [];
  transactions: Transaction[] = [];
  productsSerial: any[] = [];
  topFiveUniqeSell: any;
  constructor(private apiService: ApiServiceService) {}

  ngOnInit(): void {
    this.refreshProduct();
    this.setFiveDaysTransaction();
    this.setTopUniqeSell();
  }
  //refresh array products 
  refreshProduct() {
    this.apiService.getProducts().subscribe((data) => {
      this.products = data;
      for (let item of this.products) {
        this.topFiveSell.push({
          serialNumber: item.serialNumber,
          title: item.title,
          amount: 0
        });
      }
      this.initTransactions();
    })
  }

  initTransactions() {
    this.apiService.countTransaction().subscribe((data) => {
      if (data > 0) {
        this.apiService.getHistory().subscribe((data) => {
          for (let item of data) {
            for (let serial of item.cart.products) {
              for (let searchSerial of this.topFiveSell) {
                //console.log(searchSerial.serialNumber +' | '+ serial.serialNumber)
                if (searchSerial.serialNumber == serial.serialNumber) {
                  searchSerial.amount++;
                }
              }
            }
          }
          //arr.sort((a, b) => a.name > b.name ? 1 : -1);
          this.topFiveSell.sort((a, b) => a.amount > b.amount ? -1 : 1);
          if (this.topFiveSell.length > 5) {
            this.topFiveSell = this.topFiveSell.slice(0, 5);
          }
        })
      } else {
        return;
      }
    })
  }

  setTopFiveSell() {

  }
  getUnique(array) {
    var uniqueArray = [];

    // Loop through array values
    for (var value of array) {
      if (uniqueArray.indexOf(value) === -1) {
        uniqueArray.push(value);
      }
    }
    return uniqueArray;
  }
  countProduct: any[] = [];
  serialNumberExist(serial) {
    for (let serialNumber of this.countProduct) {
      if (serial == serialNumber.serialNumber)
        return true;
    }
    return false;
  }
  setTopUniqeSell() {
    //k is for debug
    //let k =0;
    this.apiService.countTransaction().subscribe((data) => {
      if (data > 0) {
        this.apiService.getHistory().subscribe((data) => {
          for (let item of this.products) {
            this.productsSerial.push({
              serial: item.serialNumber,
              count: 0,
              title: item.title
            });
          }
          //iterator for all transactions | item = transactions.cart  
          for (let item of data) {
            //console.log('Number cart: '+k++);
            this.countProduct = [];
            ////iterator for all products in the cart | product = cart.products.product  
            for (let product of item.cart.products) {
              if (this.countProduct) {
                if (!this.serialNumberExist(product.serialNumber)) {
                  this.countProduct.push({
                    serialNumber: product.serialNumber,
                    count: 1
                  });
                }
              }
            }
            //console.log(this.countProduct);
            //in countProduct we remove duplicate serial number from every cart and count him as one
            for (let item of this.countProduct) {
              //now we can increase the final array amount 
              for (let finalCount of this.productsSerial) {
                if (item.serialNumber == finalCount.serial) {
                  finalCount.count += 1;
                }
              }
            }
          }
          this.productsSerial.sort((a, b) => a.count > b.count ? -1 : 1);
          if (this.productsSerial.length > 5) {
            this.productsSerial = this.productsSerial.slice(0, 5);
          }
          //console.log(this.productsSerial);
        })
      } else
        return
    })
  }

  setFiveDaysTransaction() {
    this.apiService.countTransaction().subscribe((data) => {
      // console.log(data)
      if (data > 0) {
        this.apiService.getFiveDays().subscribe((data) => {
          for (let item of data) {
            //console.log(item.date.slice(0,10) + ' - ' + item.cart.total+'$');
            this.fiveDaysTransaction.push({
              date: item.date.slice(0, 10),
              total: item.cart.total
            });
            //this.fiveDaysTransaction.push({date:item.date,total:item.cart.total});
          }
          this.fiveDaysTransaction.sort((a, b) => a.date > b.date ? -1 : 1);
          if (this.fiveDaysTransaction.length > 5) {
            this.fiveDaysTransaction = this.fiveDaysTransaction.slice(0, 5);
          }


        })
      } else {
        return;
      }
    })
  }

}
