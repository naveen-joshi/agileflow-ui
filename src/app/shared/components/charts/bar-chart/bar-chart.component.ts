import { Component, Input, ElementRef, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { ChartData } from '@shared/interfaces/chart.interface';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input() data!: ChartData;
  @Input() height = 300;

  private svg: any;
  private margin = { top: 20, right: 20, bottom: 30, left: 40 };
  private width = 0;
  private innerHeight = 0;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.createChart();
  }

  ngOnChanges() {
    if (this.svg) {
      this.updateChart();
    }
  }

  private createChart() {
    const element =
      this.elementRef.nativeElement.querySelector('.chart-container');
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;

    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', this.height);

    this.updateChart();
  }

  private updateChart() {
    // Chart implementation
  }
}
