import { Component, Input, ElementRef, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { ChartData } from '@shared/interfaces/chart.interface';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input() data!: ChartData;
  @Input() height = 300;

  // ... rest of the component implementation
}
