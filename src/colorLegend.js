export const colorLegend = (selection, props) => {
    const {colorScale, spacing, textOffset, circleRadius} = props;

    const groups = selection.selectAll('g')
        .data(colorScale.domain());
    const groupEnter = groups.enter().append('g');
    groupEnter.merge(groups)
        .attr('transform', (d, i) => `translate(0, ${i * spacing})`);

    groups.exit().remove();

    // Enter & Update
    groupEnter.append('circle')
        .merge(groups.select('circle'))
        .attr('r', circleRadius)
        .attr('fill', colorScale);

    groupEnter.append('text')
        .attr('x', textOffset)
        .attr('dy', '0.32em')
        .merge(groups.select('text'))
        .text(d => d);

}