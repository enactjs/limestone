import {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import css from './Banners.module.less';

const SPONSORED_TIMEOUT = 5000;

const Banner = ({bannerInfo, contextIndex, appId, imageRef, videoRef}) => {
	const isCompanionBanner = bannerInfo.length === 2 && bannerInfo[0].type === 'image' && bannerInfo[1].type === 'video';

	const sponsoredRef = useRef(null);

	const getMediaOption = (banner) => {
		const mediaOption = {
			htmlMediaOption: {useUMSMediaInfo: true},
			option: {
				transmission: {
					adInfo: {
						contextIndex,
						appId,
						assetId: banner.id
					}
				}
			}
		};
		return `${banner.mime};mediaOption=` + encodeURI(JSON.stringify(mediaOption), 'utf-8');
	};

	useEffect(() => {
		if (sponsoredRef.current) {
			const timer = setTimeout(() => {
				sponsoredRef.current.style.display = 'none';
			}, SPONSORED_TIMEOUT);
			return () => clearTimeout(timer);
		}
	}, []);

	let content;

	if (isCompanionBanner) {
		const [imageInfo, videoInfo] = bannerInfo;
		content = (
			<div className={css.companionContainer}>
				<img
					ref={imageRef}
					src={imageInfo.contentData}
					className={css.image}
					alt=""
					aria-hidden="true"
				/>
				<video id="PPP" ref={videoRef} className={css.video}>
					<source src={videoInfo.contentData} type={getMediaOption(videoInfo)} />
				</video>
			</div>
		);
	} else {
		const currentBanner = bannerInfo[0];
		switch (currentBanner.type) {
			case 'video':
				content = (
					<video id="PPP" ref={videoRef} className={css.videoOnly}>
						<source src={currentBanner.contentData} type={getMediaOption(currentBanner)} />
					</video>
				);
				break;
			case 'image':
			default:
				content = (
					<img
						ref={imageRef}
						src={currentBanner.contentData}
						className={css.image}
						alt=""
						aria-hidden="true"
					/>
				);
		}
	}

	return (
		<div className={css.banner}>
			{content}
			{bannerInfo[0].sponsoredText &&
				<div ref={sponsoredRef} className={css.sponsoredText}>{bannerInfo[0].sponsoredText}</div>
			}
			{isCompanionBanner ?
				bannerInfo[1].overlayText && <div className={css.overlayText}>{bannerInfo[1].overlayText}</div> :
				bannerInfo[0].overlayText && <div className={css.overlayText}>{bannerInfo[0].overlayText}</div>
			}
			{bannerInfo[0].description &&
				<div className={css.description}>{bannerInfo[0].description}</div>
			}
		</div>
	);
};

Banner.propTypes = {
	bannerInfo: PropTypes.array.isRequired,
	appId: PropTypes.string,
	contextIndex: PropTypes.number,
	imageRef: PropTypes.any,
	videoRef: PropTypes.any
};

export default Banner;
