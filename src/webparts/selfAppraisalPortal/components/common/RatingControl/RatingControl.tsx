import * as React from 'react';
import { IconButton } from '@fluentui/react';
import styles from './RatingControl.module.scss';
import { IRatingControlProps } from './IRatingControlProps';

const ratingValues: number[] = [1, 2, 3, 4, 5];

export const RatingControl: React.FC<IRatingControlProps> = React.memo((props) => {
  const onSelect = React.useCallback((value: number): void => {
    if (!props.readOnly && props.onChange) {
      props.onChange(value);
    }
  }, [props]);

  return (
    <div className={styles.rating} role="radiogroup" aria-label={props.label}>
      {ratingValues.map(value => (
        <IconButton
          key={value}
          ariaLabel={`${props.label}: ${value} star`}
          className={value <= props.value ? styles.starActive : styles.star}
          disabled={props.readOnly}
          iconProps={{ iconName: value <= props.value ? 'FavoriteStarFill' : 'FavoriteStar' }}
          onClick={() => onSelect(value)}
        />
      ))}
    </div>
  );
});

