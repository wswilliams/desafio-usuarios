import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { UsuariosService } from '../usuarios/shared/usuarios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private userService: UsuariosService) {}

  ngOnInit(): void {

    this.userService.getUserStats().subscribe(data => {
      this.createChart(data);
    });
  }

  createChart(data: any): void {
    const svg = d3.select('svg');
    const margin = 50;
    const width = +svg.attr('width') - margin * 2;
    const height = +svg.attr('height') - margin * 2;

    const chart = svg.append('g').attr('transform', `translate(${margin}, ${margin})`);

    // Definir o domínio das escalas
    const x = d3.scaleBand()
      .domain(data.map((d: any) => `${d.tipo}-${d.status}`))  // Usando combinação tipo-status
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d: any) => d.count)])
      .nice()
      .range([height, 0]);

    // Eixo X e Y
    chart.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    chart.append('g')
      .call(d3.axisLeft(y));

    // Adicionar as barras
    chart.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d: any) => x(`${d.tipo}-${d.status}`))  // Usando a chave tipo-status
      .attr('y', (d: any) => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => height - y(d.count))
      .attr('fill', (d: any) => d.status === 'ativo' ? '#4285f4' : '#fbbc05');  // Cor diferente para cada status
  }

  createTipoChart(data: any, tipo: string): void {
    const filteredData = data.filter((d: any) => d.tipo === tipo);
    const svg = d3.select(`#${tipo}-chart`);
    const margin = 50;
    const width = +svg.attr('width') - margin * 2;
    const height = +svg.attr('height') - margin * 2;

    const chart = svg.append('g').attr('transform', `translate(${margin}, ${margin})`);

    const x = d3.scaleBand()
      .domain(filteredData.map((d: any) => d.status))
      .range([0, width])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(filteredData, (d: any) => d.count)])
      .nice()
      .range([height, 0]);

    chart.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    chart.append('g')
      .call(d3.axisLeft(y));

    chart.selectAll('.bar')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d: any) => x(d.status))
      .attr('y', (d: any) => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', (d: any) => height - y(d.count))
      .attr('fill', (d: any) => d.status === 'ativo' ? '#4285f4' : '#fbbc05');
  }
}
