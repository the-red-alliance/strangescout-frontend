import React from 'react';
import { FlexibleXYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines } from 'react-vis';
import { LineSeries, VerticalBarSeries } from 'react-vis';

export function BarWithTrendChart(props) {
	const { xtitle, ytitle, dataSet, bestFit } = props;

	return (
		<React.Fragment>
			{dataSet &&
					<FlexibleXYPlot>
						<VerticalGridLines />
						<HorizontalGridLines />
						<XAxis title={xtitle ? xtitle : ''} tickValues={dataSet.map(v => v.x)} tickFormat={t => t} />
						<YAxis title={ytitle ? ytitle : ''} />
						<VerticalBarSeries
						opacity="0.7"
						data={dataSet}
						/>
						{ bestFit &&
							<LineSeries
							stroke={'orange'}
							data={bestFit.endpoints}
							/>
						}
					</FlexibleXYPlot>
			}
		</React.Fragment>
	);
};
