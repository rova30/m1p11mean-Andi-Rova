import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { IncomeService } from '../../api/income.service';
import { AppointmentService } from '../../api/appointment.service';
import { ExpenseService } from '../../api/expense.service';
import { EmployeeService } from '../../api/employee.service';
import { ModalcaComponent } from '../modalca/modalca.component';
import { ModalrdvComponent } from '../modalrdv/modalrdv.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public lineBigDashboardChartType;
  public gradientStroke;
  public chartColor;
  public canvas : any;
  public ctx;
  public gradientFill;
  public lineBigDashboardChartData:Array<any>;
  public lineBigDashboardChartOptions:any;
  public lineBigDashboardChartLabels:Array<any>;
  public lineBigDashboardChartColors:Array<any>

  public gradientChartOptionsConfiguration: any;
  public gradientChartOptionsConfigurationWithNumbersAndGrid: any;

  public lineChartType;
  public lineChartData:Array<any>;
  public lineChartOptions:any;
  public lineChartLabels:Array<any>;
  public lineChartColors:Array<any>

  public lineChartWithNumbersAndGridType;
  public lineChartWithNumbersAndGridData:Array<any>;
  public lineChartWithNumbersAndGridOptions:any;
  public lineChartWithNumbersAndGridLabels:Array<any>;
  public lineChartWithNumbersAndGridColors:Array<any>

  public lineChartGradientsNumbersType;
  public lineChartGradientsNumbersData:Array<any>;
  public lineChartGradientsNumbersOptions:any;
  public lineChartGradientsNumbersLabels:Array<any>;
  public lineChartGradientsNumbersColors:Array<any>;
  expensesDetails: any[] = [];
  incomesDetails: any[] = [];
  selectedMonth = 0;
  public beneficesData: any[] = [];
  public category: any[] = [];
  public categoryIn: any[] = [];
  public expenseData: any = {
    category: '', 
    dateTime : '',
    amount : ''
  };

  public incomeData: any = {
    category: '', 
    dateTime : '',
    amount : ''
  };
  timeworks: any[] = [];

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}`;
  }

    getDetailsForMonth(month: number) {
      this.selectedMonth = month;

      this.expenseService.getExpensesDetailsByYearAndMonth(this.selectedYear, month).subscribe(data => {
        this.expensesDetails = data;
      });
  

      this.incomeService.getIncomesDetailsByYearAndMonth(this.selectedYear,month).subscribe(data => {
        this.incomesDetails = data;
      });
    }
  
  resetForm() {
    this.expenseData = {
      category: '',
      dateTime : '',
      amount : ''
    };
  }

  resetFormIn() {
    this.incomeData = {
      category: '',
      dateTime : '',
      amount : ''
    };
  }
  
  addExpense() {
    this.expenseService.addExpense(this.expenseData).subscribe(
      (response) => {
        console.log('expense added successfully:', response);
        this.resetForm();
        this.updateTable();
      },
      (error) => {
        console.error('Error adding expense:', error);
      }
    );
  }

  addIncome() {
    this.incomeService.addIncome(this.incomeData).subscribe(
      (response) => {
        console.log('income added successfully:', response);
        this.resetFormIn();
        this.updateTable();
      },
      (error) => {
        console.error('Error adding income:', error);
      }
    );
  }
  
  
  public loadExpensesCategory() {
    this.expenseService.getExpensesCategory(1, 100).subscribe(
      (data: any[]) => {
        this.category = data;
      },
      (error: any) => {
        console.error('Error fetching expensesCat:', error);
      }
    );
  }

  public loadIncomesCategory() {
    this.incomeService.getIncomesCategory(1, 100).subscribe(
      (data: any[]) => {
        this.categoryIn = data;
      },
      (error: any) => {
        console.error('Error fetching incomesCat:', error);
      }
    );
  }

  public chartClicked(event: any): void {
    if (event.active && event.active.length > 0) {
      const clickedIndex = event.active[0]._index;
      const selectedMonth = this.lineBigDashboardChartLabels[clickedIndex];
      const currentYear = new Date().getFullYear(); // Récupérer l'année en cours

      this.incomeService.getIncomesByYearAndMonth(this.selectedYear, clickedIndex + 1).subscribe(data => {
        console.log('Montants par jour pour le mois', selectedMonth, ':', data);
        this.openModalWithData(selectedMonth, data);
      });
    }
  }

  public chartClicked1(event: any): void {
    if (event.active && event.active.length > 0) {
      const clickedIndex = event.active[0]._index;
      const selectedMonth = this.lineChartGradientsNumbersLabels[clickedIndex];
      const currentYear = new Date().getFullYear(); // Récupérer l'année en cours

      this.appointmentService.getAppointmentsByYearAndMonth(this.selectedYear, clickedIndex + 1).subscribe(data => {
        console.log('Réservations par jour pour le mois', selectedMonth, ':', data);
        this.openModalWithData1(selectedMonth, data);
      });
    }
  }

  private openModalWithData(month: string, dailyAmounts: any[]): void {
    const modalRef = this.modalService.open(ModalcaComponent, { centered: true, backdrop: false }); 
    modalRef.componentInstance.selectedMonth = month; 
    modalRef.componentInstance.dailyAmounts = dailyAmounts; 
  }

  private openModalWithData1(month: string, dailyAmounts: any[]): void {
    const modalRef = this.modalService.open(ModalrdvComponent, { centered: true, backdrop: false }); 
    modalRef.componentInstance.selectedMonth = month; 
    modalRef.componentInstance.dailyAmounts = dailyAmounts; 
  }
  
  

  public chartHovered(e:any):void {
    console.log(e);
  }
  public hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }
  constructor(private employeeService: EmployeeService, private incomeService: IncomeService, private modalService: NgbModal, private appointmentService: AppointmentService, private expenseService: ExpenseService) {
    this.lineBigDashboardChartData = [];
    this.lineBigDashboardChartLabels = [];
    this.lineChartGradientsNumbersData = [];
    this.lineChartGradientsNumbersLabels = [];
  }


  public resumeBenefice(selectedYear: number): void {
    this.beneficesData = [];
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
    this.incomeService.getIncomesByMonth(selectedYear).subscribe(incomeData => {
      this.expenseService.getExpensesByMonth(selectedYear).subscribe(expenseData => {
        months.forEach(month => {
          const incomeAmount = incomeData.find(item => item.month === month)?.totalAmount || 0;
          const expenseAmount = expenseData.find(item => item.month === month)?.totalAmount || 0;
          const benefice = incomeAmount - expenseAmount;
          this.beneficesData.push({
            month: month,
            income: incomeAmount,
            expense: expenseAmount,
            benefice: benefice
          });
        });
      });
    });
  }

  public avgtimeWork(): void {
    this.employeeService.getAverageTimeWork().subscribe(
      (data: any[]) => {
        this.timeworks = data;
      },
      (error: any) => {
        console.error('Error fetching customers:', error);
      }
    );
  }

updateTable(): void {
  this.resumeBenefice(this.selectedYear);
}

availableYears: number[] = [];
selectedYear: number = new Date().getFullYear();


initAvailableYears(): void {
  const currentYear = new Date().getFullYear();
  this.availableYears = Array.from({ length: 3 }, (_, i) => currentYear - i); 
}


updateChartData(): void {
  this.getIncomesByMonth(this.selectedYear);
  this.getAppointmentsByMonth(this.selectedYear);
}


onYearChange(event: any): void {
  this.selectedYear = event.target.value; 
  this.updateChartData(); 
  this.updateTable();
}



getIncomesByMonth(year: number): void {
  this.incomeService.getIncomesByMonth(year).subscribe((data) => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const incomeData = months.map(month => {
      const monthData = data.find(item => item.month === month);
      return monthData ? monthData.totalAmount : 0;
    });

    this.lineBigDashboardChartData = [
      {
        label: "Montant",
        pointBorderWidth: 1,
        pointHoverRadius: 7,
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        fill: true,
        borderWidth: 2,
        data: incomeData
      }
    ];

    this.lineBigDashboardChartLabels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  });
}


getAppointmentsByMonth(year:number): void {
  this.appointmentService.getAppointmentsByMonth(year).subscribe((data) => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const appointmentData = months.map(month => {
      const monthData = data.find(item => item.month === month);
      return monthData ? monthData.totalAppointments : 0;
    });
    console.log(appointmentData);

  this.lineChartGradientsNumbersData = [
    {
      label: "Nombre",
      pointBorderWidth: 2,
      pointHoverRadius: 4,
      pointHoverBorderWidth: 1,
      pointRadius: 4,
      fill: true,
      borderWidth: 1,
      data: appointmentData
    }];

    this.lineChartGradientsNumbersLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  });
  }

  ngOnInit() {
    this.chartColor = "#FFFFFF";
    this.canvas = document.getElementById("bigDashboardChart");
    this.ctx = this.canvas.getContext("2d");

    this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
    this.gradientStroke.addColorStop(0, '#80b6f4');
    this.gradientStroke.addColorStop(1, this.chartColor);

    this.gradientFill = this.ctx.createLinearGradient(0, 200, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.24)");

    

    const currentYear = new Date().getFullYear();
    this.initAvailableYears(); // Initialiser les années disponibles
    this.updateChartData(); // Mettre à jour les données du graphique avec l'année sélectionnée par défaut
    this.updateTable();
    this.loadExpensesCategory();
    this.loadIncomesCategory();
    this.avgtimeWork();


    this.lineBigDashboardChartOptions = {

          layout: {
              padding: {
                  left: 20,
                  right: 20,
                  top: 0,
                  bottom: 0
              }
          },
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: '#fff',
            titleFontColor: '#333',
            bodyFontColor: '#666',
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest"
          },
          legend: {
              position: "bottom",
              fillStyle: "#FFF",
              display: false
          },
          scales: {
              yAxes: [{
                  ticks: {
                      fontColor: "rgba(255,255,255,0.4)",
                      fontStyle: "bold",
                      beginAtZero: true,
                      maxTicksLimit: 5,
                      padding: 10
                  },
                  gridLines: {
                      drawTicks: true,
                      drawBorder: false,
                      display: true,
                      color: "rgba(255,255,255,0.1)",
                      zeroLineColor: "transparent"
                  }

              }],
              xAxes: [{
                  gridLines: {
                      zeroLineColor: "transparent",
                      display: false,

                  },
                  ticks: {
                      padding: 10,
                      fontColor: "rgba(255,255,255,0.4)",
                      fontStyle: "bold"
                  }
              }]
          }
    };

    this.lineBigDashboardChartType = 'line';


    this.gradientChartOptionsConfiguration = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: 1,
      scales: {
        yAxes: [{
          display: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          display: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 15
        }
      }
    };

    this.gradientChartOptionsConfigurationWithNumbersAndGrid = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: true,
      scales: {
        yAxes: [{
          gridLines: {
            zeroLineColor: "transparent",
            drawBorder: false
          },
          ticks: {
              stepSize: 500
          }
        }],
        xAxes: [{
          display: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 15
        }
      }
    };



    this.canvas = document.getElementById("barChartSimpleGradientsNumbers");
    this.ctx = this.canvas.getContext("2d");

    this.gradientFill = this.ctx.createLinearGradient(0, 170, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, this.hexToRGB('#2CA8FF', 0.6));



    this.lineChartGradientsNumbersColors = [
     {
       backgroundColor: this.gradientFill,
       borderColor: "#2CA8FF",
       pointBorderColor: "#FFF",
       pointBackgroundColor: "#2CA8FF",
     }
   ];

   this.lineChartGradientsNumbersOptions = {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          bodySpacing: 4,
          mode: "nearest",
          intersect: 0,
          position: "nearest",
          xPadding: 10,
          yPadding: 10,
          caretPadding: 10
        },
        responsive: 1,
        scales: {
          yAxes: [{
            gridLines: {
              zeroLineColor: "transparent",
              drawBorder: false
            },
            ticks: {
                stepSize: 20
            }
          }],
          xAxes: [{
            display: 0,
            ticks: {
              display: false
            },
            gridLines: {
              zeroLineColor: "transparent",
              drawTicks: false,
              display: false,
              drawBorder: false
            }
          }]
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 15,
            bottom: 15
          }
        }
      }

    this.lineChartGradientsNumbersType = 'bar';
  }

  
  ngOnDestroy():void {
  }

}
