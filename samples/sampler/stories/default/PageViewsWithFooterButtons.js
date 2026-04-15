import Spotlight from '@enact/spotlight';
import Button from '@enact/limestone/Button';
import {PageViews} from '@enact/limestone/PageViews';
import Item from '@enact/limestone/Item';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select} from '@enact/storybook-utils/addons/controls';
import {Cell, Row, Column} from '@enact/ui/Layout';
import {useEffect, useRef, useState} from 'react';

PageViews.displayName = 'PageViews';

const Config = mergeComponentMetadata('PageViews', PageViews);
Config.defaultProps = {
	pageIndicatorPosition: 'bottom',
	pageIndicatorType: 'dot'
};

const propOptions = {
	pageIndicatorPosition: ['bottom', 'top'],
	pageIndicatorType: ['dot', 'number']
};

const TOTAL_PAGES = 4;

export default {
	title: 'Limestone/PageViewsWithFooterButtons',
	component: 'PageViews'
};

export const _PageViewsWithFooterButtons = {
	render: (args) => {
		const [index, setIndex] = useState(0);
		const isLastPage = index === TOTAL_PAGES - 1;
		const navigationSource = useRef(null);

		// 요구사항 2: 처음 로드될 때 Next 버튼에 포커스 (bannerMode일 때 제외)
		useEffect(() => {
			if (!args['bannerMode']) {
				Spotlight.focus('footer-next-btn');
			}
		}, []); // eslint-disable-line react-hooks/exhaustive-deps

		const handleChange = (ev) => {
			setIndex(ev.index);
			action('onChange')(ev);
		};

		// 내부 Next 버튼 클릭 시 소스 기록
		const handleNextClick = (ev) => {
			navigationSource.current = 'internal-next';
			action('onNextClick')(ev);
		};

		// 내부 Prev 버튼 클릭 시 소스 기록
		const handlePrevClick = (ev) => {
			navigationSource.current = 'internal-prev';
			action('onPrevClick')(ev);
		};

		// 요구사항 4: 하단 Next 버튼으로 navigate
		const handleFooterNext = () => {
			navigationSource.current = 'footer';
			setIndex((prev) => Math.min(prev + 1, TOTAL_PAGES - 1));
		};

		const handleTransition = (ev) => {
			const source = navigationSource.current;
			const newIndex = ev.index;

			// 요구사항 4 & 5: 네비게이션 소스에 따라 포커스 결정 (bannerMode일 때 제외)
			if (!args['bannerMode']) {
				if (source === 'footer') {
					// 하단 Next로 navigate → 다음 페이지가 마지막이면 Close, 아니면 Next에 포커스
					Spotlight.focus(newIndex === TOTAL_PAGES - 1 ? 'footer-close-btn' : 'footer-next-btn');
				} else if (source === 'internal-next' && newIndex === TOTAL_PAGES - 1) {
					// 내부 Next로 마지막 페이지 도착 → Close에 포커스
					Spotlight.focus('footer-close-btn');
				} else if (source === 'internal-prev' && newIndex === 0) {
					// 내부 Prev로 첫 페이지 도착 → Next에 포커스
					Spotlight.focus('footer-next-btn');
				}
				// 그 외 내부 navigate → Spotlight이 내부 버튼 포커스 자연 유지
			}

			navigationSource.current = null;
			action('onTransition')(ev);
		};

		return (
			<div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
				<PageViews
					bannerMode={args['bannerMode']}
					fullContents={args['fullContents']}
					index={index}
					onChange={handleChange}
					onNextClick={handleNextClick}
					onPrevClick={handlePrevClick}
					onTransition={handleTransition}
					onWillTransition={action('onWillTransition')}
					pageIndicatorPosition={args['pageIndicatorPosition']}
					pageIndicatorType={args['pageIndicatorType']}
					style={{flex: 1, minHeight: 0}}
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
				{/* 요구사항 1 & 3: 하단 버튼 영역, 마지막 페이지엔 Next 없음, bannerMode일 때 전체 숨김 */}
				{!args['bannerMode'] ? (
					<div style={{flexShrink: 0, display: 'flex', justifyContent: 'center', gap: '12px'}}>
						<Button spotlightId="footer-close-btn" onClick={action('onClose')}>Close</Button>
						{!isLastPage ? (
							<Button spotlightId="footer-next-btn" onClick={handleFooterNext}>Next</Button>
						) : null}
					</div>
				) : null}
			</div>
		);
	}
};

boolean('bannerMode', _PageViewsWithFooterButtons, Config, false);
boolean('fullContents', _PageViewsWithFooterButtons, Config, false);
select('pageIndicatorPosition', _PageViewsWithFooterButtons, propOptions.pageIndicatorPosition, Config, 'bottom');
select('pageIndicatorType', _PageViewsWithFooterButtons, propOptions.pageIndicatorType, Config, 'dot');

_PageViewsWithFooterButtons.storyName = 'PageViewsWithFooterButtons';
_PageViewsWithFooterButtons.parameters = {
	info: {
		text: 'PageViews with footer Close/Next buttons — app level implementation'
	}
};
