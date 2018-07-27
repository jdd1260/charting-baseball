import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import * as _ from 'lodash';

import { loadData, bestPeriodPerPlayer } from '../../utils/data';
import { fieldAndSortingOptions } from '../../utils/fields';

import './index.css';


// sizing of chart
const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const width = 950 - margin.left - margin.right;
const height = 550 - margin.top - margin.bottom;

// setup legend
const legendHeight = 10;
const legendWidth = 50;
const legendYPosition = height / 5;
const lightColor = '#ff5656';
const darkColor = '#000000';

// setup x data handling
const xValue = d => d.rank; // data -> value
const xScale = d3.scale.linear().range([0, width]); // value -> display
const xMap = d => xScale(xValue(d)); // data -> display
const xAxis = d3.svg
  .axis()
  .scale(xScale)
  .orient('bottom');

// setup y data handling
const yValue = d => d.rankedStat; // data -> value
const yScale = d3.scale.linear().range([height, 0]); // value -> display
const yMap = d => yScale(yValue(d)); // data -> display
const yAxis = d3.svg
  .axis()
  .scale(yScale)
  .orient('left');

// setup dot color
const cValue = d => d.Age;
const colorScale = d3.scale.linear().range([lightColor, darkColor]);

export default class Chart extends Component {
  static propTypes = {
    NUM_SEASONS: PropTypes.number.isRequired,
    FIELD: PropTypes.string.isRequired,
    IS_HITTERS: PropTypes.bool.isRequired,
    annotatedPlayers: PropTypes.arrayOf(PropTypes.string)
  };

  updateData() {
    const { NUM_SEASONS, FIELD, IS_HITTERS } = this.props;
    const ASCENDING = fieldAndSortingOptions[IS_HITTERS ? 'hitters' : 'pitchers'][FIELD];

    loadData(IS_HITTERS).then(data => {
      const playerBests = bestPeriodPerPlayer(
        data,
        NUM_SEASONS,
        FIELD,
        ASCENDING
      );
      const forDisplay = _.map(playerBests, (player, index) => {
        player.rank = _.round((1 - (index + 1) / playerBests.length) * 100, 1);
        player.rankedStat = player[FIELD];
        return player;
      });
      this.redraw(forDisplay, { NUM_SEASONS, FIELD, IS_HITTERS, ASCENDING });
    });
  }

  makeTooltip(data, FIELD) {
    return `
      <table style='font-size:12px'>
      <tr><td> Name </td><td> ${ data.Name }</td>
      <tr><td> Seasons </td><td> ${ data.Seasons }</td>
      <tr><td> Teams </td><td> ${ data.Team }</td>
      <tr><td> Age </td><td> ${ data.Age } </td>
      <tr><td> ${ FIELD } </td><td> ${ yValue(data) } </td>
      <tr><td> Percentile </td><td>  ${ xValue(data) } </td>
      </table>
    `;
  }

  redraw(data, { NUM_SEASONS, FIELD, IS_HITTERS, ASCENDING }) {
    const svg = d3.select('#chart #chart-body');
    const tooltip = d3.select('#dynamic-tooltip');
    d3.selectAll('.tooltip').style('opacity', 0);
    svg.html(null);

    // Set scale of axes
    xScale.domain([d3.min(data, xValue) - 0.05, d3.max(data, xValue) + 1]);
    yScale.domain([d3.min(data, yValue) * 0.95, d3.max(data, yValue) * 1.05]);

    // set color scale
    const ages = _.map(data, 'Age');
    colorScale.domain([_.min(ages), _.max(ages)]);

    // label x-axis
    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .append('text')
      .attr('class', 'label')
      .attr('y', margin.bottom)
      .attr('x', width / 2)
      .style('text-anchor', 'middle')
      .text('Percentile');

    // label y-axis
    svg
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '.7em')
      .style('text-anchor', 'middle')
      .text(FIELD);

    // draw dots with tooltip
    svg
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 4)
      .attr('cx', xMap)
      .attr('cy', yMap)
      .style('fill', d => colorScale(cValue(d)))
      .on('mouseover', (d) => {
        tooltip
          .transition()
          .duration(100)
          .style('opacity', 1);

        const offset = ASCENDING ? 0 : -200;
        tooltip
          .html(this.makeTooltip(d, FIELD))
          .style('left', d3.event.pageX + offset + 'px')
          .style('top', d3.event.pageY + 'px');
      })
      .on('mouseout', function() {
        tooltip
          .transition()
          .duration(1000)
          .style('opacity', 0);
      });

    //draw annotated players
    this.props.annotatedPlayers.forEach((player, index) => {
      d3.selectAll('.dot')[0].forEach((dot) => {
        if (player === _.get(dot, '__data__.Name')) {
          const playerData = dot.__data__;
          const annotation = d3.select('#static-tooltip-' + (index + 1));
          annotation
            .transition()
            .duration(100)
            .style('opacity', 0.9);

          const offset = ASCENDING ? 0 : -200;
          const bound = dot.getBoundingClientRect();
          const html = document.documentElement;
          const y = bound.top + window.pageYOffset - html.clientTop + 6;
          const x = bound.left + window.pageXOffset - html.clientLeft + 6;
          annotation
            .html(this.makeTooltip(playerData, FIELD))
            .style('left', x + offset + 'px')
            .style('top', y + 'px');
        }
      });
    });

    // draw legend
    let legendData = [
      { age: colorScale.domain()[0], color: colorScale.range()[0] },
    ];
    const ageInterpolator = d3.interpolate(
      colorScale.domain()[0],
      colorScale.domain()[1]
    );
    const colorInterpolator = d3.interpolateRgb(
      colorScale.range()[0],
      colorScale.range()[1]
    );
    legendData = legendData.concat(
      _.map([0.25, 0.5, 0.75, 1], function(d) {
        return { age: ageInterpolator(d), color: colorInterpolator(d) };
      })
    );

    const legendXPosition = ASCENDING
      ? margin.left
      : width - legendData.length * legendWidth;
    const legend = svg
      .selectAll('.legend')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        return (
          'translate(' +
          (legendXPosition + i * legendWidth) +
          ', ' +
          (legendYPosition + legendHeight) +
          ')'
        );
      });

    // draw legend colored rectangles
    legend
      .append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', function(d) {
        return d.color;
      });

    // draw legend text
    legend
      .append('text')
      .attr('x', legendWidth / 2)
      .attr('y', legendHeight)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(function(d) {
        return _.round(d.age, 1);
      });
    // draw legend title
    svg
      .append('text')
      .attr('x', legendXPosition + (legendData.length * legendWidth) / 2)
      .attr('y', legendYPosition)
      .attr('text-anchor', 'middle')
      .style('font-size', '1em')
      .text("Player's Average Age During Period");

    // draw chart title
    const title =
      'Average Performance for ' +
      (IS_HITTERS ? 'Hitters' : 'Pitchers') +
      ' Over Best ' +
      NUM_SEASONS +
      ' Year Period';
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 4)
      .attr('text-anchor', 'middle')
      .style('font-size', '1.5em')
      .text(title);
  }

  componentDidMount() {
    this.updateData();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.IS_HITTERS !== prevProps.IS_HITTERS ||
      this.props.NUM_SEASONS !== prevProps.NUM_SEASONS ||
      this.props.FIELD !== prevProps.FIELD
    ) {
      this.updateData();
    }
  }

  render() {
    return (
      <div>
        <div id="chart-container">
          <svg
            id="chart"
            width={width + margin.left + margin.right}
            height={height + margin.top + margin.bottom}
          >
            <g id="chart-body" transform={'translate(' + margin.left + ',' + margin.top + ')'} />
          </svg>
        </div>
        <div className="tooltip" id="dynamic-tooltip" style={{ opacity: 0 }} />
        <div className="tooltip" id="static-tooltip-1" style={{ opacity: 0 }} />
        <div className="tooltip" id="static-tooltip-2" style={{ opacity: 0 }} />
      </div>
    );
  }
}
