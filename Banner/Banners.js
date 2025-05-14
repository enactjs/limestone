import {use, useEffect, Suspense, useCallback, useMemo, useRef, useState} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import Spottable from '@enact/spotlight/Spottable';
import platform from '@enact/core/platform';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import {Row, Cell} from '@enact/ui/Layout';
import {forwardWithPrevent, handle} from '@enact/core/handle';
import ViewManager from '@enact/ui/ViewManager';
import {on, off} from '@enact/core/dispatcher';
import css from './Banners.module.less';
import Banner from './Banner';
import {BasicArranger} from '../internal/Panels';
import Steps from '../Steps';
import Button from '../Button';
import {is} from '@enact/core/keymap';
import ri from '@enact/ui/resolution';
import $L from '../internal/$L';
import IString from 'ilib/lib/IString';
import DebounceDecorator from '../internal/DebounceDecorator';
import FallbackComponent from './BannersFallback';
import {requestBannerInfo, sendImpressionTracker, requestAssetClickInfo} from '@enact/webos/ads';
import TimerDisplay from './TimerDisplay';
import useAnnounce from '@enact/ui/AnnounceDecorator/useAnnounce';
import {readAlert} from '@enact/webos/speech';
import PropTypes from 'prop-types';

const IMPRESSION_TIMEOUT = 1000;
const DEFAULT_ROTATION_TIME = 5;
const FOCUS_MARGIN = 6;
const SpottableContainer = Spottable('div');
const SpotlightContainer = SpotlightContainerDecorator('div');

const Banners = ({appId, isActive, isVisible, bannerPromise, width = '100%', height = 'auto', defaultBanner, bannerPrepended, bannerAppended}) => {
	const [index, setIndex] = useState(0);
	const isBannerFocused = useRef(false);
	const isVideoEnded = useRef(false);
	const rotationTimer = useRef({id: null, expiry: 0});
	const focusTimer = useRef(null);
	const prevIsVisible = useRef(isVisible);
	const prevIsActive = useRef(isActive);
	const imageRef = useRef(null);
	const videoRef = useRef(null);

	const bannerInfo = use(bannerPromise);
	const contextIndex = bannerInfo?.contextIndex;
	const bannerAsset = useMemo(() => {
		let assets = bannerInfo?.assets || [];

		if (assets.length === 0) {
			console.log('No banners available, using default banner');
			assets = [[{...defaultBanner, type: 'default'}]];
		}

		if (bannerPrepended && typeof bannerPrepended === 'object') {
			assets = [[{...bannerPrepended, type: 'prepended'}], ...assets];
		}

		if (bannerAppended && typeof bannerAppended === 'object') {
			assets = [...assets, [{...bannerAppended, type: 'appended'}]];
		}

		return assets;
	}, [bannerInfo, defaultBanner, bannerPrepended, bannerAppended]);

	const totalIndex = bannerAsset?.length ?? 0;
	const currentBanner = bannerAsset?.[index];
	const isCompanionBanner = useMemo(() => {
		if (currentBanner?.length === 2) {
			return currentBanner[0].type === 'image' && currentBanner[1].type === 'video';
		}
		return false;
	}, [currentBanner]);
	const currentBannerType = isCompanionBanner ? 'companion' : currentBanner?.[0].type;

	console.log('Banner info:', bannerAsset);
	console.log('Current banner type:', currentBannerType);
	console.log('Banner Size:', width, '*', height);


	const {announce, children: announceNode} = useAnnounce();

	// TODO
	const announceMessage = useMemo(() => {
		return [
			'Promotion',
			currentBanner?.[0]?.description,
			isCompanionBanner ? currentBanner?.[1]?.overlayText : currentBanner?.[0]?.overlayText,
			new IString($L('Page {current} out of {total}')).format({current: index + 1, total: totalIndex})
		].filter(Boolean).join(' ');
	}, [currentBanner, isCompanionBanner, index, totalIndex]);

	useEffect(() => {
		if (isBannerFocused.current) {
			if (platform.type === 'webos') {
				readAlert(announceMessage);
			} else {
				announce(announceMessage);
			}
			console.log('Announce message:', announceMessage);
		}
	}, [index, announceMessage, announce]);

	const clearFocusTimer = useCallback(() => {
		if (focusTimer.current) {
			clearTimeout(focusTimer.current);
		}
	}, []);

	const clearRotationTimer = useCallback(() => {
		if (rotationTimer.current.id) {
			console.log('[CLEAR ROTATION TIMER] id: ', rotationTimer.current.id);
			clearTimeout(rotationTimer.current.id);
			rotationTimer.current.id = null;
			rotationTimer.current.expiry = 0;
		}
	}, []);

	const playVideo = useCallback((muted) => {
		if (isVisible && !isVideoEnded.current && videoRef.current !== null) {
			const mediaElement = videoRef.current;

			mediaElement.muted = muted;
			mediaElement.play().catch((error) => {
				console.error('Error playing video:', error);
			});
		}

	}, [isVisible]);

	const pauseVideo = useCallback(() => {
		if (videoRef.current !== null) {
			const mediaElement = videoRef.current;
			mediaElement.pause();
		}
	}, []);

	const startRotationTimer = useCallback(() => {
		if (!isVisible || totalIndex === 1) return;
		clearRotationTimer();
		const timeout = currentBanner?.[0]?.rotationTime || DEFAULT_ROTATION_TIME;
		rotationTimer.current.expiry = Date.now() + timeout * 1000;
		rotationTimer.current.id = setTimeout(() => {
			setIndex((prevIndex) => (prevIndex + 1) % totalIndex);
		}, timeout * 1000);
		console.log('[START ROTATION TIMER] timeout: ', timeout, rotationTimer.current);
	}, [isVisible, currentBanner, totalIndex, clearRotationTimer]);

	const startFocusTimer = useCallback(() => {
		if (!isVisible) return;
		clearFocusTimer();
		focusTimer.current = setTimeout(() => {
			const params = {appId: appId, contextIndex: contextIndex, assetId: currentBanner?.[0]?.id, trackingEvent: 'hovering'};
			sendImpressionTracker(params);
		}, IMPRESSION_TIMEOUT);
	}, [appId, contextIndex, currentBanner, isVisible, clearFocusTimer]);

	const handleLoad = useCallback(() => {
		console.log('Image banner loaded');
		if (!isBannerFocused.current && currentBannerType !== 'companion') {
			startRotationTimer();
		}

		const params = {
			appId: appId,
			contextIndex: contextIndex,
			assetId: currentBanner?.[0]?.id,
			trackingEvent: 'creativeView'
		};
		sendImpressionTracker(params);

	}, [appId, contextIndex, currentBanner, currentBannerType, startRotationTimer]);

	const handleLoadedData = useCallback(() => {
		console.log('Video banner loaded');
		isVideoEnded.current = false;
		playVideo(!isBannerFocused.current);
		const params = {
			appId: appId,
			contextIndex: contextIndex,
			assetId: currentBanner?.[0]?.id,
			trackingEvent: 'creativeView'
		};
		sendImpressionTracker(params);
	}, [appId, contextIndex, currentBanner, playVideo]);

	const handleIncrementIndex = useCallback((ev) => {
		if (ev) {
			ev.stopPropagation();
		}
		clearRotationTimer();
		clearFocusTimer();
		setIndex((prevIndex) => (prevIndex + 1) % totalIndex);
	}, [totalIndex, clearRotationTimer, clearFocusTimer]);

	const handleDecrementIndex = useCallback((ev) => {
		if (ev) {
			ev.stopPropagation();
		}
		clearRotationTimer();
		clearFocusTimer();
		setIndex((prevIndex) => (prevIndex - 1 + totalIndex) % totalIndex);
	}, [totalIndex, clearRotationTimer, clearFocusTimer]);

	const keyDownHandler = useCallback(() => handle(
		forwardWithPrevent('onKeyDown'),
		(ev) => {
			const keyCode = ev.keyCode;

			if (is('left', keyCode)) {
				handleDecrementIndex();
				ev.stopPropagation();
			} else if (is('right', keyCode)) {
				handleIncrementIndex();
				ev.stopPropagation();
			}
		}
	), [handleDecrementIndex, handleIncrementIndex]);

	const handleFocus = useCallback(() => {
		startFocusTimer();
		isBannerFocused.current = true;
		console.log('Banner focused');
		if ((currentBannerType === 'video' || currentBannerType === 'companion') && videoRef.current !== null) { // if it is video
			videoRef.current.muted = false;
		} else {
			clearRotationTimer();
		}
		if (platform.type === 'webos') {
			readAlert(announceMessage);
		} else {
			announce(announceMessage);
		}
		console.log(announceMessage);
	}, [currentBannerType, startFocusTimer, clearRotationTimer, announce, announceMessage]);

	const handleBlur = useCallback(() => {
		clearFocusTimer();
		isBannerFocused.current = false;
		console.log('Banner unfocused');
		if ((currentBannerType === 'video' || currentBannerType === 'companion') && videoRef.current !== null) { // if it is video
			videoRef.current.muted = true;
		} else {
			startRotationTimer();
		}
	}, [currentBannerType, clearFocusTimer, startRotationTimer]);

	const handleClick = useCallback(() => {
		if (currentBanner?.[0]?.clickHandler) {
			currentBanner?.[0]?.clickHandler();
		} else {
			const params = {appId: appId, contextIndex: contextIndex, assetId: currentBanner?.[0]?.id};
			requestAssetClickInfo(params);
		}
	}, [appId, contextIndex, currentBanner]);

	useEffect(() => {
		if (prevIsVisible.current && !isVisible) {
			console.log('rotation timer cleared by isVisible change', isVisible, videoRef.current);
			if (currentBannerType === 'video' || currentBannerType === 'companion') {
				pauseVideo();
			}
			clearRotationTimer();

		} else if (!prevIsVisible.current && isVisible) {
			if (currentBannerType === 'video' || currentBannerType === 'companion') {
				playVideo(!isBannerFocused.current);
				if (isVideoEnded.current) {
					startRotationTimer();
				}
			} else {
				startRotationTimer();
			}
			console.log('rotation timer started by isVisible change', isVisible);
		}

		prevIsVisible.current = isVisible;
	}, [isVisible, currentBannerType, clearRotationTimer, startRotationTimer, pauseVideo, playVideo]);

	useEffect(() => {
		if (!prevIsActive.current && isActive && videoRef.current !== null) {
			console.log('Reload video when active for reset video');
			videoRef.current.load(); // Reload video when active for reset video
		}

		prevIsActive.current = isActive;
	}, [isActive]);

	useEffect(() => {
		let img = imageRef.current;
		let video = videoRef.current;

		const handlePlay = () => {
			console.log('VIDEO Playing');
			isVideoEnded.current = false;
		};
		const handleEnded = () => {
			console.log('VIDEO Ended');
			isVideoEnded.current = true;
			pauseVideo();
			startRotationTimer();
		};

		if (img) {
			img.onload = handleLoad;
		}

		if ((currentBannerType === 'video' || currentBannerType === 'companion') && video) {
			video.onloadeddata = handleLoadedData;
			video.addEventListener('play', handlePlay);
			video.addEventListener('ended', handleEnded);

			playVideo(!isBannerFocused.current);
		}

		return () => {
			if (img) img.onload = null;
			if (video) {
				video.onloadeddata = null;
				video.removeEventListener('play', handlePlay);
				video.removeEventListener('ended', handleEnded);
			}
		};
	}, [
		index,
		currentBannerType,
		handleLoad,
		handleLoadedData,
		pauseVideo,
		playVideo,
		startRotationTimer
	]);

	const renderViewManager = useCallback(({children}) => {
		return (
			<Cell
				className={css.viewManager}
				arranger={BasicArranger}
				component={ViewManager}
				index={index}
				noAnimation
			>
				{children}
			</Cell>
		);
	}, [index]);

	const navButtons = useMemo(() => (
		<Row className={css.navButtonContainer}>
			<Cell spotlightId="PrevNavButton" className={css.navButtonCell} shrink>
				<SpotlightContainer spotlightId="PrevNavButton">
					<Button
						aria-label={$L('Previous')}
						icon="arrowlargeleft"
						iconFlip="auto"
						onClick={handleDecrementIndex}
						onFocus={handleFocus}
						size="small"
					/>
				</SpotlightContainer>

			</Cell>
			<Cell />
			<Cell className={css.navButtonCell} shrink>
				<SpotlightContainer spotlightId="NextNavButton">
					<Button
						aria-label={$L('Next')}
						icon="arrowlargeright"
						iconFlip="auto"
						id="NextNavButton"
						onClick={handleIncrementIndex}
						onFocus={handleFocus}
						size="small"
					/>
				</SpotlightContainer>
			</Cell>
		</Row>
	), [handleFocus, handleDecrementIndex, handleIncrementIndex]);

	useEffect(() => {
		Spotlight.remove('PrevNavButton');
		Spotlight.remove('NextNavButton');
	}, [navButtons]);

	return (
		<SpotlightContainer>
			{announceNode}
			<SpottableContainer
				className={css.banners}
				style={{
					width: ri.scale(width),
					height: ri.scale(height),
					margin: `${FOCUS_MARGIN}px auto`
				}}
				onKeyDown={keyDownHandler}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onClick={handleClick}
			>
				<TimerDisplay timerRef={rotationTimer} label="Rotation Timer" />
				{totalIndex > 1 && navButtons}
				{renderViewManager({
					children: bannerAsset?.map((info) => (
						<Banner
							key={info[0].id}
							bannerInfo={info}
							contextIndex={contextIndex}
							appId={appId}
							imageRef={imageRef}
							videoRef={videoRef}

						/>
					))
				})}
				{totalIndex > 1 &&
					<Row className={css.stepsRow}>
						<Steps
							css={css}
							current={index + 1}
							highlightCurrentOnly
							total={totalIndex}
						/>
					</Row>
				}
			</SpottableContainer>
		</SpotlightContainer>

	);
};

Banners.propTypes = {
	bannerPromise: PropTypes.any.isRequired,
	appId: PropTypes.string,
	bannerAppended: PropTypes.object,
	bannerPrepended: PropTypes.object,
	defaultBanner: PropTypes.object,
	height: PropTypes.number,
	isActive: PropTypes.bool,
	isVisible: PropTypes.bool,
	width: PropTypes.number
};

const BannerCarouselBase = ({appId, slotName, requestWidth, requestHeight, width = '100%', height = 'auto', bannerAppended, bannerPrepended, defaultBanner}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [isActive, setIsActive] = useState(true);

	const containerRef = useRef(null);
	const params = useMemo(() => ({
		appId: appId,
		slotName: slotName,
		width: requestWidth,
		height: requestHeight,
		autoSend: false
	}), [appId, slotName, requestWidth, requestHeight]);

	const [bannerPromise, setBannerPromise] = useState(() => requestBannerInfo(params));

	const handleVisibilityChange = useCallback((event) => {
		console.log('visibility changed', event);
		if (!event.target?.hidden) {
			setBannerPromise(requestBannerInfo(params));
			setIsActive(true);
		} else {
			setIsActive(false);
		}
	}, [params]);

	const renderErrorFallback = useCallback(({error, resetErrorBoundary}) => {
		console.log('Error in BannerCarousel:', error);
		return (
			<FallbackComponent
				width={width}
				height={height}
				error={error}
				resetErrorBoundary={resetErrorBoundary}
			/>
		);
	}, [width, height]);

	useEffect(() => {
		const node = containerRef.current;
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting);
			},
			{threshold: Number.isInteger(width) ? (width - FOCUS_MARGIN) / width : 1}
		);

		if (node) {
			observer.observe(node);
		}

		return () => {
			if (node) {
				observer.unobserve(node);
			}
		};
	}, []);

	useEffect(() => {
		if (typeof window === 'object') {
			if (typeof (window.webOSSystem ?? window.PalmSystem) === 'object') {
				on('webkitvisibilitychange', handleVisibilityChange, document);
			} else {
				on('visibilitychange', handleVisibilityChange, document);
			}
		}

		return () => {
			if (typeof window === 'object') {
				if (typeof (window.webOSSystem ?? window.PalmSystem) === 'object') {
					off('webkitvisibilitychange', handleVisibilityChange, document);
				} else {
					off('visibilitychange', handleVisibilityChange, document);
				}
			}
		};
	}, [handleVisibilityChange]);

	return (
		<div
			ref={containerRef}
			style={{
				display: 'flex',
				justifyContent: 'center',
				textAlign: 'center'
			}}
		>
			<ErrorBoundary
				fallbackRender={renderErrorFallback}
			>
				<Suspense fallback={<FallbackComponent width={width} height={height} />}>
					<Banners
						appId={appId}
						isVisible={isVisible}
						isActive={isActive}
						bannerPromise={bannerPromise}
						width={width}
						height={height}
						bannerAppended={bannerAppended}
						bannerPrepended={bannerPrepended}
						defaultBanner={defaultBanner}
					/>
				</Suspense>
			</ErrorBoundary>
		</div>
	);
};

BannerCarouselBase.propTypes = {
	appId: PropTypes.string,
	bannerAppended: PropTypes.object,
	bannerPrepended: PropTypes.object,
	defaultBanner: PropTypes.object,
	height: PropTypes.number,
	requestHeight: PropTypes.number,
	requestWidth: PropTypes.number,
	slotName: PropTypes.string,
	width: PropTypes.number
};

const BannerCarousel = DebounceDecorator({debounce: 'onClick', delay: 250}, BannerCarouselBase);

export default BannerCarousel;
export {
	BannerCarousel
};
