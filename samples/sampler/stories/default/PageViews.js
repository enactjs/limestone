import {PageViews} from '@enact/limestone/PageViews';
import Item from '@enact/limestone/Item';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select} from '@enact/storybook-utils/addons/controls';
import {Cell, Row, Column} from '@enact/ui/Layout';

PageViews.displayName = 'PageViews';

const Config = mergeComponentMetadata('PageViews', PageViews);
Config.defaultProps = {
	pageIndicatorPosition: 'bottom',
	pageIndicatorType: 'dot',
	showFooterButtons: false
};

const propOptions = {
	pageIndicatorPosition: ['bottom', 'top'],
	pageIndicatorType: ['dot', 'number']
};

export default {
	title: 'Limestone/PageViews',
	component: 'PageViews'
};

export const _PageViews = {
	render: (args) => (
		<PageViews
			bannerMode={args['bannerMode']}
			fullContents={args['fullContents']}
			onChange={action('onChange')}
			onFooterCloseClick={action('onFooterCloseClick')}
			onFooterNextClick={action('onFooterNextClick')}
			onNextClick={action('onNextClick')}
			onPrevClick={action('onPrevClick')}
			onTransition={action('onTransition')}
			onWillTransition={action('onWillTransition')}
			pageIndicatorPosition={args['pageIndicatorPosition']}
			pageIndicatorType={args['pageIndicatorType']}
			showFooterButtons={args['showFooterButtons']}
		>
			<PageViews.Page aria-label="This is a description for page 1">
				<div style={{padding: '24px', width: '50%'}}>
					<Item>Item 1</Item>
					<Item>Item 2</Item>
				</div>
			</PageViews.Page>
			<PageViews.Page aria-label="This is a description for page 2">
				<Column style={{padding: '24px'}}>
					<Row style={{padding: '12px'}}>
						<Cell>Country</Cell>
						<Cell>City</Cell>
						<Cell>Team</Cell>
						<Cell>Rank</Cell>
					</Row>
					<Row style={{padding: '12px'}}>
						<Cell>Korea</Cell>
						<Cell>Seoul</Cell>
						<Cell>Team A</Cell>
						<Cell>1</Cell>
					</Row>
					<Row style={{padding: '12px'}}>
						<Cell>USA</Cell>
						<Cell>NewYork</Cell>
						<Cell>Team B</Cell>
						<Cell>2</Cell>
					</Row>
					<Row style={{padding: '12px'}}>
						<Cell>France</Cell>
						<Cell>Paris</Cell>
						<Cell>Team C</Cell>
						<Cell>3</Cell>
					</Row>
				</Column>
			</PageViews.Page>
			<PageViews.Page>
				<div style={{padding: '24px'}}>
					This is page 3
				</div>
			</PageViews.Page>
			<PageViews.Page>
				<div style={{height: '100%', backgroundColor: 'grey'}}>
					This is page 4
				</div>
			</PageViews.Page>
		</PageViews>
	)
};

boolean('bannerMode', _PageViews, Config, false);
boolean('fullContents', _PageViews, Config, false);
boolean('showFooterButtons', _PageViews, Config, false);
select('pageIndicatorPosition', _PageViews, propOptions.pageIndicatorPosition, Config, 'bottom');
select('pageIndicatorType', _PageViews, propOptions.pageIndicatorType, Config, 'dot');

_PageViews.storyName = 'PageViews';
_PageViews.parameters = {
	info: {
		text: 'The basic PageViews'
	}
};
