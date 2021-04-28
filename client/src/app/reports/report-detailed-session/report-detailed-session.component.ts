import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportDto } from 'src/app/core/dtos/reportDto';
import { SessionReportDto } from 'src/app/core/dtos/sessionReportDto';
import { AlertService } from 'src/app/core/services/alert.service';
import { RepositoryService } from 'src/app/core/services/repository.service';
import { SessionsService } from 'src/app/core/services/sessions.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-report-detailed-session',
  templateUrl: './report-detailed-session.component.html',
  styleUrls: ['./report-detailed-session.component.scss']
})
export class ReportDetailedSessionComponent  implements OnInit {
  filterUserId: number;
  sessionReports?: SessionReportDto[];
  sessionReportDatas?: ReportDto[];
  selectedSessionReport: ReportDto;
  quClientId: number;
  quTherapistId: number;

  private barChart: Chart;
  private lineChart: Chart;

  constructor(
    private sessionSer: SessionsService,
    private mainRepo: RepositoryService,
    private alertify: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.selectedSessionReport = new ReportDto();
  }

  ionViewWillEnter() {
    this.quClientId = this.route.snapshot.queryParams.clientId ? Number(this.route.snapshot.queryParams.clientId) : 0;
    this.quTherapistId = this.route.snapshot.queryParams.therapistId ? Number(this.route.snapshot.queryParams.therapistId) : 0;
    this.sessionReports = [];
    this.sessionReportDatas = [];
    this.selectedSessionReport = new ReportDto();
    this.filterUserId = Number(this.route.snapshot.params.id); // if client then filter therapist
    this.bindSessionReports();
    // this.createBarChart();
    // this.createLineChart();
    this.getChart();
  }

  private bindSessionReports(): void {
    if (this.quClientId > 0) { // for admin
      console.log(this.quClientId);
      this.sessionSer.getReportByClient(this.quClientId).subscribe((res: SessionReportDto[]) => {
        this.sessionReports = res;
      }, error => {
        this.alertify.presentAlert('Error', error);
      }, () => {
        this.getDatas();
      });
    } else if (this.quTherapistId > 0) { // for admin
      this.sessionSer.getReportByTherapist(this.quTherapistId).subscribe((res: SessionReportDto[]) => {
        this.sessionReports = res;
      }, error => {
        this.alertify.presentAlert('Error', error);
      }, () => {
        this.getDatas();
      });
    } else {
      if (this.mainRepo.loggedInUser.roleType.trim().toLowerCase() === 'client') {
        this.sessionSer.getReportByClient(this.mainRepo.loggedInUser.id).subscribe((res: SessionReportDto[]) => {
          this.sessionReports = res;
        }, error => {
          this.alertify.presentAlert('Error', error);
        }, () => {
          this.getDatas();
        });
      } else {
        this.sessionSer.getReportByTherapist(this.mainRepo.loggedInUser.id).subscribe((res: SessionReportDto[]) => {
          this.sessionReports = res;
        }, error => {
          this.alertify.presentAlert('Error', error);
        }, () => {
          this.getDatas();
        });
      }
    }
  }

  private getDatas(): void {
    this.sessionReportDatas.length = 0;
    this.sessionReports.forEach(report => {
      if (this.quClientId > 0) {
        if (report.therapist.id === this.filterUserId) {
          this.sessionReportDatas.push(this.fillReportDto(report));
        }
      } else if (this.quTherapistId > 0) {
        if (report.client.id === this.filterUserId) {
          this.sessionReportDatas.push(this.fillReportDto(report));
        }
      } else {
        if (this.mainRepo.loggedInUser.roleType.trim().toLowerCase() === 'client') {
          if (report.therapist.id === this.filterUserId) {
            this.sessionReportDatas.push(this.fillReportDto(report));
          }
        } else {
          if (report.client.id === this.filterUserId) {
            this.sessionReportDatas.push(this.fillReportDto(report));
          }
        }
      }
    });
    console.log(this.sessionReportDatas);
    if (this.sessionReportDatas.length > 0) {
      this.selectedSessionReport = new ReportDto();
      Object.assign(this.selectedSessionReport, this.sessionReportDatas[0]);
      this.getChart();
    }
  }

  private fillReportDto(dto: SessionReportDto): ReportDto {
    const reportDto: ReportDto = new ReportDto();
    let index = 0;
    if (this.sessionReportDatas) {
      index = this.sessionReportDatas.reduce((acc, shot) => acc = acc > shot.index ? acc : shot.index, 0);
    }
    reportDto.index = index + 1;
    reportDto.id = dto.id;
    reportDto.appointment = dto.appointment;
    reportDto.client = dto.client;
    reportDto.therapist = dto.therapist;
    reportDto.chartLabels.push('Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise');
    reportDto.datas.push(dto.angry, dto.disgust, dto.fear,
      dto.happy, dto.neutral, dto.sad, dto.surprise);
    reportDto.levels.push(dto.depressionLevel, dto.improvementLevel);
    return reportDto;
  }

  private getChart() {
    if (!this.barChart) {
      this.createBarChart();
    } else {
      this.removeData(this.barChart);
      this.addData(
        this.barChart,
        this.selectedSessionReport.chartLabels,
        this.selectedSessionReport.datas
      );
      this.barChart.update();
    }

    if (!this.lineChart) {
      this.createLineChart();
    } else {
      this.removeData(this.lineChart);
      this.addData(
        this.lineChart,
        ['Depression Level', 'Improvement Level'],
        this.selectedSessionReport.levels
      );
      this.barChart.update();
    }
  }

  private removeData(chart) {
    chart.data.labels.length = 0;
    chart.data.datasets.forEach(dataset => {
      dataset.data.length = 0;
    });
    chart.update();
  }
  private addData(chart, labels, datas) {
    labels.forEach(element => {
      chart.data.labels.push(element);
    });
    chart.data.datasets.forEach(dataset => {
      datas.forEach(element => {
        dataset.data.push(element);
      });
    });
    chart.update();
  }

  createBarChart() {
    Chart.register(...registerables);
    if (this.selectedSessionReport) {
      this.barChart = new Chart('barCanvas', {
        type: 'bar',
        data: {
          labels: this.selectedSessionReport.chartLabels,
          datasets: [
            {
              label: 'Emotions Classifications',
              data: this.selectedSessionReport.datas,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2',
                'rgba(255, 99, 132, 0.2)',
              ],
              borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1',
                'rgba(255,99,132,1)',
              ],
              borderWidth: 1
            }
          ]
        }
      });
    }
  }

  createLineChart() {
    Chart.register(...registerables);
    if (this.selectedSessionReport) {
      this.lineChart = new Chart('lineCanvas', {
        type: 'bar',
        data: {
          labels: ['Depression Level', 'Improvement Level'],
          datasets: [
            {
              label: 'Emotion Levels',
              data: this.selectedSessionReport.levels,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)'
              ],
              borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)'
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          indexAxis: 'y',
        }
      });
    }
  }

  change() {
    if (this.sessionReportDatas.length > 0) {
      const m = this.sessionReportDatas.filter(x => x.id === Number(this.selectedSessionReport.id))[0];
      Object.assign(this.selectedSessionReport, m);
    }
    this.getChart();
  }

  back(): void {
    // admin_session_therapist?therapistId=0&clientId=81
    if (this.quClientId > 0) {
      this.router.navigate(['/reports/admin_session_therapist'], {queryParams: { therapistId: 0,  clientId: this.quClientId}});
    } else if (this.quTherapistId > 0) {
      this.router.navigate(['/reports/admin_session_client'], {queryParams: { therapistId: this.quTherapistId,  clientId: 0}});
    } else {
      if (this.mainRepo.loggedInUser.roleType.trim().toLowerCase() === 'client') {
        this.router.navigate(['reports/session_therapist']);
      } else {
        this.router.navigate(['reports/session_client']);
      }
    }
  }
}
