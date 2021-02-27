import {csv, range, timeParse} from "d3";

const parseYear = timeParse('%Y');
const allCaps = str => str === str.toUpperCase();
const isRegion = name => allCaps(name) && (name !== 'WORLD');

const melt = (unData, minYear, maxYear) => {
    const years = range(minYear, maxYear + 1);

    const data = [];

    unData.forEach(d => {
        const name = d['Region, subregion, country or area *'];

        years.forEach(year => {
            const population = +d[year].replace(/ /g, '') * 1000;
            const row = {
                year: parseYear(year),
                name,
                population
            };
            data.push(row);
        });
    });

    return data.filter(d => isRegion(d.name));
}

export const loadAndProcessData = () => {
    return Promise
        .all([
            csv('./un-population-estimates-2017-medium-variant.csv'),
            csv('./un-population-estimates-2017.csv'),
        ])
        .then(([unDataMediumVariant, unDataEstimates]) => {
            return melt(unDataEstimates, 1950, 2014)
                .concat(melt(unDataMediumVariant, 2015, 2100));

            // const rowById = unData.reduce((accumulator, d) => {
            //     accumulator[d['Country code']] = d;
            //     return accumulator;
            // }, {});
            //
            // const countries = feature(topoJSONdata, topoJSONdata.objects.countries);
            // countries.features.forEach(d => {
            //     Object.assign(d.properties, rowById[+d.id]);
            // });
            //
            // const featuresWithPopulation = countries.features
            //     .filter(d => d.properties['2020'])
            //     .map(d => {
            //         d.properties['2020'] = +d.properties['2020'].replace(/ /g, '') * 1000;
            //         return d;
            //     });
            //
            // console.log(featuresWithPopulation);
            //
            // return {countries, featuresWithPopulation};
        });
};
