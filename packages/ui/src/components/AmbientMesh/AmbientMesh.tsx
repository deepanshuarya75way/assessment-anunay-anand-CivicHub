import React from 'react';
import styles from './AmbientMesh.module.css';
import { clsx } from 'clsx';

export interface AmbientMeshProps {
  className?: string;
}

export function AmbientMesh({ className }: AmbientMeshProps) {
  return (
    <div className={clsx(styles.meshContainer, className)} aria-hidden="true">
      <div className={clsx(styles.blob, styles.blobPrimary)} />
      <div className={clsx(styles.blob, styles.blobSecondary)} />
      <div className={clsx(styles.blob, styles.blobTertiary)} />
    </div>
  );
}
