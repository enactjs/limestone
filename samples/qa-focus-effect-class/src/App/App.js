import Button from '@enact/limestone/Button';
import CheckboxItem from '@enact/limestone/CheckboxItem';
import {Header, Panel, Panels} from '@enact/limestone/Panels';
import ThemeDecorator from '@enact/limestone/ThemeDecorator';
import {setFocusEffectClass} from '@enact/spotlight/SpotlightRootDecorator';
import {Row} from '@enact/ui/Layout';
import {useCallback, useState} from 'react';

import css from './App.module.less';


const App = (props) => {
	const [hasFocusEffectClass, setHasFocusEffectClass] = useState(false);

	const onToggleDisabled = useCallback(() => {
		const next = !hasFocusEffectClass;
		setHasFocusEffectClass(next);
		setFocusEffectClass(next ? css.focusClass : null);
	}, [hasFocusEffectClass]);

	return (
		<Panels {...props}>
			<Panel>
				<Header type="mini">
					<title>QA Sample - Focus Effect Class</title>
						<CheckboxItem onClick={onToggleDisabled}>Enable focusEffectClass</CheckboxItem>
					<hr />
				</Header>

				<Row>
					<Button className={css.button1} size="large">
						Button with data-spotlight-focused attribute
					</Button>
				</Row>
				<Row>
					<Button className={css.button2} size="large">
						Button with general focus effect class
					</Button>
				</Row>
				<Row>
					<Button className={css.button2} size="large">
						Button with general focus effect class
					</Button>
				</Row>
			</Panel>
		</Panels>
	);
};

export default ThemeDecorator(App);
