import * as React from 'react';
import { Spinner, SpinnerSize } from '@fluentui/react';
import styles from './Loader.module.scss';
import { ILoaderProps } from './ILoaderProps';

export const Loader: React.FC<ILoaderProps> = React.memo((props) => (
  <div className={styles.loader} role="status" aria-live="polite">
    <Spinner size={SpinnerSize.large} label={props.label} />
  </div>
));

