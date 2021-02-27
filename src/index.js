import {
    descending,
    nest,
    scaleOrdinal,
    schemeCategory10,
    select
} from 'd3';

import {loadAndProcessData} from "./loadAndProcessData";
import {colorLegend} from "./colorLegend";
import {lineChart} from "./lineChart";

const svg = select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

const lineChartG = svg.append('g');
const colorLegendG = svg.append('g');

let selectedYear = 2018;

let data;

const setSelectedYear = year => {
    selectedYear = year;
    render();
};

const render = () => {

    const yValue = d => d.population;
    const colorValue = d => d.name;
    const colorScale = scaleOrdinal(schemeCategory10);
    const lastYValue = d => yValue(d.values[d.values.length - 1]);

    const nested = nest()
        .key(colorValue)
        .entries(data)
        .sort((a, b) => descending(lastYValue(a), lastYValue(b)));

    colorScale.domain(nested.map(d => d.key));

    lineChartG.call(lineChart, {
        colorScale,
        colorValue,
        yValue,
        nested,
        selectedYearDate: selectedYear,
        titleText: 'A Week of Temperature Around the Region',
        xValue: d => d.year,
        xAxisLabel: 'Year',
        yAxisLabel: 'Population',
        margin: {top: 80, right: 0, bottom: 70, left: 105},
        width,
        height,
        data,
        setSelectedYear
    });

    colorLegendG
        .attr('transform', `translate(720, 180)`)
        .call(colorLegend, {
            colorScale,
            spacing: 24,
            textOffset: 16,
            circleRadius: 10

        });


};

loadAndProcessData()
    .then((loadedData) => {
        data = loadedData;
        render();
    });