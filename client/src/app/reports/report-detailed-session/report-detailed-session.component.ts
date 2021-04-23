import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('barCanvas') barCanvas: ElementRef;

  private barChart: Chart;

  constructor(
    private sessionSer: SessionsService,
    private mainRepo: RepositoryService,
    private alertify: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.sessionReports = [];
    this.sessionReportDatas = [];
    this.selectedSessionReport = new ReportDto();
    this.filterUserId = Number(this.route.snapshot.params.id); // if client then filter therapist
    this.bindSessionReports();
    this.createBarChart();
  }

  private bindSessionReports(): void {
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

  private getDatas(): void {
    this.sessionReportDatas.length = 0;
    this.sessionReports.forEach(report => {
      if (this.mainRepo.loggedInUser.roleType.trim().toLowerCase() === 'client') {
        if (report.therapist.id === this.filterUserId) {
          this.sessionReportDatas.push(this.fillReportDto(report));
        }
      } else {
        if (report.client.id === this.filterUserId) {
          this.sessionReportDatas.push(this.fillReportDto(report));
        }
      }
    });
    if (this.sessionReportDatas.length > 0) {
      this.selectedSessionReport = new ReportDto();
      Object.assign(this.selectedSessionReport, this.sessionReportDatas[0]);
      this.getChart();
    }
  }

  private fillReportDto(dto: SessionReportDto): ReportDto {
    const reportDto: ReportDto = new ReportDto();
    reportDto.id = dto.appointment.id;
    reportDto.appointment = dto.appointment;
    reportDto.client = dto.client;
    reportDto.therapist = dto.therapist;
    reportDto.chartLabels.push('Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise');
    reportDto.datas.push(dto.angry, dto.disgust, dto.fear,
      dto.happy, dto.neutral, dto.sad, dto.surprise);
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
              label: 'Emotions',
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

  change() {
    if (this.sessionReportDatas.length > 0) {
      const m = this.sessionReportDatas.filter(x => x.id === Number(this.selectedSessionReport.id))[0];
      Object.assign(this.selectedSessionReport, m);
    }
    this.getChart();
  }

  back(): void {
    this.router.navigate(['reports/session_therapist']);
  }
}
