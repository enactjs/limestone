import {useCallback} from 'react';
import PropTypes from 'prop-types';
import ri from '@enact/ui/resolution';
import $L from '../internal/$L';
import Spottable from '@enact/spotlight/Spottable';
import {Button} from '@enact/limestone/Button';
import {Spinner} from '@enact/limestone/Spinner';
import css from './Banners.module.less';

const SpottableFallbackContainer = Spottable('div');

const FallbackComponent = ({width, height, error, resetErrorBoundary}) => {
	const retry = useCallback(() => {
		if (resetErrorBoundary) {
			resetErrorBoundary();
		}
	}, [resetErrorBoundary]);

	return (
		<SpottableFallbackContainer
			className={css.banners}
			style={{
				width: ri.scale(width),
				height: ri.scale(height),
				margin: '6px auto'
			}}
			onClick={retry}
		>
			{error ? (
				<Button
					style={{margin: 'auto'}}
					icon="refresh"
					aria-label={$L('Retry')}
					onClick={retry}
				/>
			) : (
				<Spinner centered transparent />
			)}
		</SpottableFallbackContainer>
	);
};

FallbackComponent.propTypes = {
	height: PropTypes.string.isRequired,
	width: PropTypes.string.isRequired,
	error: PropTypes.any,
	resetErrorBoundary: PropTypes.func
};

export default FallbackComponent;
