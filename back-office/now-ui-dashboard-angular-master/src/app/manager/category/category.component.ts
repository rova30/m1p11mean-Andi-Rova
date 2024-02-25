import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../api/expense.service';
import { IncomeService } from '../../api/income.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
    incomesCat: any[] = [];
    expensesCat: any[] = [];
    error: string = '';
    currentPageIn: number = 1; 
    totalPagesIn: number = 0; 
    currentPageEx: number = 1; 
    totalPagesEx: number = 0; 
    pageSize: number = 10;
    
    loadingIn: boolean = false;
    loadingEx: boolean = false;

    expenseCatData: any = {
        category: ''
      };

    incomeCatData: any = {
        type: ''
    };
  
    constructor(private incomeService: IncomeService, private expenseService: ExpenseService) { }
  
    ngOnInit() {
      this.loadIncomesCategory();
      this.loadTotalIncomesCategoryCount();
      this.loadExpensesCategory();
      this.loadTotalExpensesCategoryCount();
    }
    ngOnDestroy():void {
    }
  
    loadIncomesCategory() {
      this.error = '';
      this.loadingIn = true;
    
      this.incomeService.getIncomesCategory(this.currentPageIn, this.pageSize).subscribe(
        (data: any[]) => {
          this.incomesCat = data;
          this.loadingIn = false;
        },
        (error: any) => {
          console.error('Error fetching incomesCat:', error);
          this.error = 'Error fetching incomesCat';
          this.loadingIn = false;
        }
      );
    }
  
    loadTotalIncomesCategoryCount() {
      this.incomeService.totalIncomesCategoryCount().subscribe(
        (count: number) => {
          this.totalPagesIn = Math.ceil(count / this.pageSize);
        },
        (error: any) => {
          console.error('Error fetching total incomesCat count:', error);
        }
      );
    }
  
    // Méthodes pour naviguer entre les pages
    prevPageIn() {
      if (this.currentPageIn > 1) {
        this.currentPageIn--;
        this.loadIncomesCategory();
      }
    }
  
    nextPageIn() {
      if (this.currentPageIn < this.totalPagesIn) {
        this.currentPageIn++;
        this.loadIncomesCategory();
      }
    }

    resetFormIn() {
        this.incomeCatData = {
          type: ''
        };
      }

    addIncomeCat() {
    this.incomeService.addIncomeCategory(this.incomeCatData).subscribe(
        (response) => {
        console.log('incomeCat added successfully:', response);
        this.resetFormIn();
        this.loadIncomesCategory();
        },
        (error) => {
        console.error('Error adding incomeCat:', error);
        
        }
    );
    }



    loadExpensesCategory() {
        this.error = '';
        this.loadingEx = true;
      
        this.expenseService.getExpensesCategory(this.currentPageIn, this.pageSize).subscribe(
          (data: any[]) => {
            this.expensesCat = data;
            this.loadingEx = false;
          },
          (error: any) => {
            console.error('Error fetching expensesCat:', error);
            this.error = 'Error fetching expensesCat';
            this.loadingEx = false;
          }
        );
      }
    
      loadTotalExpensesCategoryCount() {
        this.expenseService.totalExpensesCategoryCount().subscribe(
          (count: number) => {
            this.totalPagesEx = Math.ceil(count / this.pageSize);
          },
          (error: any) => {
            console.error('Error fetching total incomesCat count:', error);
          }
        );
      }
    
      // Méthodes pour naviguer entre les pages
      prevPageEx() {
        if (this.currentPageIn > 1) {
          this.currentPageIn--;
          this.loadExpensesCategory();
        }
      }
    
      nextPageEx() {
        if (this.currentPageIn < this.totalPagesEx) {
          this.currentPageIn++;
          this.loadExpensesCategory();
        }
      }

      resetFormEx() {
        this.expenseCatData = {
          category: ''
        };
      }

      addExpenseCat() {
        this.expenseService.addExpenseCategory(this.expenseCatData).subscribe(
            (response) => {
            console.log('expenseCat added successfully:', response);
            this.resetFormEx();
            this.loadExpensesCategory();
            },
            (error) => {
            console.error('Error adding expenseCat:', error);
            
            }
        );
        }
}
