import React, { useEffect, useRef } from 'react';
import h337 from 'heatmap.js';

export function Heatmap(props) {
	const { data, fieldImgUrl } = props;

	const heatmapRef = useRef();

	const gridSpec = {
		width: 54,
		height: 27,
		scale: 2
	};

	useEffect(() => {
		// calculate a scale ratio from the grid size to the pixel dimensions of the heatmap container element
		// heatmapRef.current is the dom node of the ref, offsetWidth/Height are dimensions of the node
		const scales = {
			xScale: heatmapRef.current.offsetWidth / gridSpec.width,
			yScale: heatmapRef.current.offsetHeight / gridSpec.height
		};

		// create the heatmap instance
		const heatmapInstance = h337.create({ container: heatmapRef.current });
		// filter the dataset to x/y points and exclude nulls
		const usablePoints = data.map(point => ({x: point.x, y: point.y})).filter(point => point.x && point.y);

		// define the empty grid
		// the grid is an array of arrays set to field dimensions * grid scale
		let grid = new Array((gridSpec.width * gridSpec.scale) + 1).fill(null);
		grid.forEach((row, i) => grid[i] = new Array((gridSpec.height * gridSpec.scale) + 1).fill(0));

		// for each of our usable points multiply the x and y by the grid scale, then increment the grid counter at that point
		usablePoints.forEach(point => grid[Math.floor(point.x * gridSpec.scale)][Math.floor(point.y * gridSpec.scale)] += 1);

		// empty datapoints array
		let dataPoints = [];
		// default max value of 0
		let max = 0;

		// for each row
		grid.forEach((row, x) => {
			// for each value (coordinate) in that row
			row.forEach((val, y) => {
				// if the value is > 0
				if (val > 0) {
					// update the max value if needed
					max = Math.max(max, val);
					// add the datapoint
					dataPoints.push({
						// calculate x/y values
						// grid point / grid scale * grid to pixel ratio
						x: (x / gridSpec.scale) * scales.xScale,
						y: (gridSpec.height - (y / gridSpec.scale)) * scales.yScale,
						value: val
					});
				}
			});
		});

		heatmapInstance.setData({
			min: 0,
			max: max,
			data: dataPoints
		});

	}, [gridSpec, data]);

	return (
		<div id="heatmap" ref={heatmapRef}>
			<svg
			viewBox="0 0 54 27"
			style={{
				background: `url(${fieldImgUrl}) no-repeat center center`,
				backgroundSize: 'cover',
			}}
			/>
		</div>
	)
}

export default Heatmap;