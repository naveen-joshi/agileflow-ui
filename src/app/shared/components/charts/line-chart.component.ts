import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import * as d3 from 'd3';
import { BaseType } from 'd3';

export interface ChartData {
  date: Date;
  value: number;
}

type D3Selection = d3.Selection<SVGGElement, unknown, HTMLElement, any>;
type D3GSelection = d3.Selection<SVGGElement, unknown, HTMLElement, any>;

@Component({
  selector: 'app-line-chart',
  standalone: true,
  template: ` <div #chartContainer class="w-full h-full"></div> `,
})
export class LineChartComponent implements OnInit {
  @ViewChild('chartContainer', { static: true })
  private chartContainer!: ElementRef<HTMLDivElement>;

  data = input<ChartData[]>([]);
  width = input<number>(700);
  height = input<number>(400);
  color = input<string>('#1976d2');

  private svg!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private margin = { top: 20, right: 20, bottom: 30, left: 40 };

  constructor() {
    effect(() => {
      if (this.data().length > 0) {
        this.createChart();
      }
    });
  }

  ngOnInit() {
    this.createChart();
  }

  private createChart(): void {
    const element = this.chartContainer.nativeElement;

    // Clear any existing SVG
    d3.select(element).select('svg').remove();

    this.svg = d3.select(element).append('svg') as unknown as d3.Selection<
      SVGGElement,
      unknown,
      HTMLElement,
      any
    >;
  }

  private updateChart(): void {
    const width = this.width() - this.margin.left - this.margin.right;
    const height = this.height() - this.margin.top - this.margin.bottom;

    // Clear existing elements
    this.svg.selectAll('*').remove();

    // Create scales
    const x = d3
      .scaleTime<number>()
      .domain(d3.extent(this.data(), (d: ChartData) => d.date) as [Date, Date])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.data(), (d: ChartData) => d.value) || 0])
      .range([height, 0]);

    // Create line generator
    const line = d3
      .line<ChartData>()
      .x((d: ChartData) => x(d.date))
      .y((d: ChartData) => y(d.value))
      .curve(d3.curveMonotoneX);

    // Add axes with grid lines
    this.svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat((d: Date | d3.NumberValue) => {
            if (d instanceof Date) {
              return d3.timeFormat('%b %d')(d);
            }
            return '';
          })
      )
      .call((g: D3Selection) => {
        g.select('.domain').attr('stroke-opacity', 0.2);
        return g;
      })
      .call((g: D3Selection) => {
        g.selectAll('.tick line')
          .attr('stroke-opacity', 0.2)
          .attr('stroke-dasharray', '2,2');
        return g;
      });

    this.svg
      .append('g')
      .call(d3.axisLeft(y))
      .call((g) => g.select('.domain').attr('stroke-opacity', 0.2))
      .call((g) =>
        g
          .selectAll('.tick line')
          .attr('x2', width)
          .attr('stroke-opacity', 0.2)
          .attr('stroke-dasharray', '2,2')
      );

    // Add area under the line
    const area = d3
      .area<ChartData>()
      .x((d) => x(d.date))
      .y0(height)
      .y1((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    this.svg
      .append('path')
      .datum(this.data())
      .attr('fill', `${this.color()}20`)
      .attr('d', area);

    // Add line path with animation
    const path = this.svg
      .append('path')
      .datum(this.data())
      .attr('fill', 'none')
      .attr('stroke', this.color())
      .attr('stroke-width', 2)
      .attr('d', line);

    const pathLength = path.node()?.getTotalLength() || 0;
    path
      .attr('stroke-dasharray', pathLength)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(1000)
      .attr('stroke-dashoffset', 0);

    // Add dots with tooltips and hover effects
    this.svg
      .selectAll('.dot')
      .data(this.data())
      .join('circle')
      .attr('class', 'dot')
      .attr('cx', (d: ChartData) => x(d.date))
      .attr('cy', (d: ChartData) => y(d.value))
      .attr('r', 4)
      .attr('fill', this.color())
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on(
        'mouseover',
        function (this: BaseType | SVGCircleElement, event: any, d: ChartData) {
          d3.select(this as SVGCircleElement)
            .transition()
            .duration(200)
            .attr('r', 6);
        }
      )
      .on(
        'mouseout',
        function (this: BaseType | SVGCircleElement, event: any, d: ChartData) {
          d3.select(this as SVGCircleElement)
            .transition()
            .duration(200)
            .attr('r', 4);
        }
      )
      .append('title')
      .text(
        (d: ChartData) =>
          `${d.date.toLocaleDateString()}\nValue: ${d.value.toLocaleString()}`
      );
  }
}
