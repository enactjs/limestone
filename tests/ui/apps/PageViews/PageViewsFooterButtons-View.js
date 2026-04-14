import {PageViews} from '../../../../PageViews';
import ThemeDecorator from '../../../../ThemeDecorator';
import spotlight from '@enact/spotlight';

// NOTE: Forcing pointer mode off so we can be sure that regardless of webOS pointer mode the app
// runs the same way
spotlight.setPointerMode(false);

const app = (props) => <div {...props}>
	<PageViews showFooterButtons pageIndicatorType="dot">
		<PageViews.Page id="FooterTestPage1">Page 1</PageViews.Page>
		<PageViews.Page id="FooterTestPage2">Page 2</PageViews.Page>
		<PageViews.Page id="FooterTestPage3">Page 3</PageViews.Page>
	</PageViews>
</div>;

export default ThemeDecorator(app);
