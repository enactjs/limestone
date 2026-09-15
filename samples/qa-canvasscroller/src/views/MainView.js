import BodyText from '@enact/limestone/BodyText';
import Button from '@enact/limestone/Button';
import CanvasScroller from '@enact/limestone/CanvasScroller';
import Heading from '@enact/limestone/Heading';
import {Panel, Header} from '@enact/limestone/Panels';
import Scroller from '@enact/limestone/Scroller';
import ri from '@enact/ui/resolution';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

const WORDS = ('the quick brown fox jumps over lazy dog webos television settings network picture ' +
	'sound channel input device account privacy policy terms service agreement software update ' +
	'license content provider streaming application display resolution brightness contrast colour ' +
	'temperature calibration accessibility subtitle audio description remote control voice ' +
	'recognition assistant recommendation').split(' ');

// Deterministic generator so DOM and canvas render byte-identical content.
const lcg = (seed) => {
	let s = seed >>> 0;

	return () => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return s / 4294967296;
	};
};

const makeBlocks = (sections) => {
	const rnd = lcg(12345);
	const blocks = [];

	for (let i = 0; i < sections; i++) {
		blocks.push({type: 'heading', text: `Section ${i + 1} — ${WORDS[(rnd() * WORDS.length) | 0]}`});

		for (let p = 0; p < 4; p++) {
			const n = 55 + ((rnd() * 45) | 0);
			const w = [];

			for (let k = 0; k < n; k++) w.push(WORDS[(rnd() * WORDS.length) | 0]);

			const text = w.join(' ');

			blocks.push({type: 'paragraph', text: `${text.charAt(0).toUpperCase()}${text.slice(1)}.`});
		}
	}

	return blocks;
};

const SIZES = [50, 200, 400];

const MainView = () => {
	const [mode, setMode] = useState('canvas');
	const [sections, setSections] = useState(200);
	const [buildMs, setBuildMs] = useState(null);
	const startRef = useRef(null);

	const blocks = useMemo(() => makeBlocks(sections), [sections]);

	const onToggleMode = useCallback(() => {
		startRef.current = performance.now();
		setBuildMs(null);
		setMode((m) => (m === 'canvas' ? 'dom' : 'canvas'));
	}, []);

	const onCycleSize = useCallback(() => {
		startRef.current = performance.now();
		setBuildMs(null);
		setSections((s) => SIZES[(SIZES.indexOf(s) + 1) % SIZES.length]);
	}, []);

	// Time from the button press to the frame after the new subtree is on screen. Rough, but it is
	// the number that actually differs between the two strategies.
	useEffect(() => {
		if (startRef.current === null) return;

		const t0 = startRef.current;

		startRef.current = null;

		const id = requestAnimationFrame(() => requestAnimationFrame(() => {
			setBuildMs(Math.round(performance.now() - t0));
		}));

		return () => cancelAnimationFrame(id);
	}, [mode, sections]);

	const contentWidth = ri.scale(1600);

	return (
		<Panel>
			<Header title="CanvasScroller vs DOM" subtitle={`${mode} · ${sections} sections · ${blocks.length} blocks${buildMs === null ? '' : ` · +${buildMs}ms to paint`}`}>
				<Button onClick={onToggleMode}>{mode === 'canvas' ? 'Switch to DOM' : 'Switch to canvas'}</Button>
				<Button onClick={onCycleSize}>{`Size: ${sections}`}</Button>
			</Header>
			{mode === 'canvas' ? (
				<CanvasScroller
					blocks={blocks}
					contentWidth={contentWidth}
					key={`canvas-${sections}`}
				/>
			) : (
				<Scroller direction="vertical" focusableScrollbar="byEnter" key={`dom-${sections}`}>
					<div style={{width: `${contentWidth}px`}}>
						{blocks.map((b, i) => (
							b.type === 'heading' ?
								<Heading key={i} size="small">{b.text}</Heading> :
								<BodyText key={i}>{b.text}</BodyText>
						))}
					</div>
				</Scroller>
			)}
		</Panel>
	);
};

export default MainView;
